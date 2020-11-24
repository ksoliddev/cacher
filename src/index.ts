const handlers = require('./handlers');
import Security from './security';
import { Storage } from './interfaces/storage.interface';
import MemoryStorage from './storages/memory.storage';
import { CacheDataType } from './types/data.type';
import RedisStorage from './storages/redis.storage';

class Cacher {

private options : any;
private storage : Storage = new MemoryStorage();

private orderUrlQuerys(url : string){
    const queryArray = url.split('?');
    if (queryArray.length === 2){
        const query = queryArray[1];
        const array = query.split('&').sort();
        url =  `${queryArray[0]}?${array.join('&')}`;
    }
    return url;
}

private generateRequestId(req : any) : string{
    const {originalUrl} = req;
    const originalUrlOrded = this.orderUrlQuerys(originalUrl);
    return Security.encrypt(originalUrlOrded);
}

private generateResource(req : any) : string{
    const {originalUrl} = req;
    const array = (originalUrl.split('?').shift()).split('/');
    const resource = array[1];
    console.log("resource: ", resource);
    return Security.encrypt(resource);
}

private accumulateContent(res : any, content : any) {
    if (content) {
      if (typeof content == 'string') {
        res._apicache.content = (res._apicache.content || '') + content
      } else if (Buffer.isBuffer(content)) {
        var oldContent = res._apicache.content

        if (typeof oldContent === 'string') {
          oldContent = !Buffer.from ? new Buffer(oldContent) : Buffer.from(oldContent)
        }

        if (!oldContent) {
          oldContent = !Buffer.alloc ? new Buffer(0) : Buffer.alloc(0)
        }

        res._apicache.content = Buffer.concat(
          [oldContent, content],
          oldContent.length + content.length
        )
      } else {
        res._apicache.content = content
      }
    }
  }

private createCacheObject(status : any, headers : any, data : any, encoding : any) {
    return {
      status,
      headers,
      data,
      encoding,
      timestamp: new Date().getTime() / 1000, // seconds since epoch.  This is used to properly decrement max-age headers in cached responses.
    }
  }

private makeResponseCacheable(res : any, next : any) {

    return new Promise((resolve : any, reject : any) => {
    // monkeypatch res.end to create cache object
    res._apicache = {
      write: res.write.bind(res),
      writeHead: res.writeHead.bind(res),
      end: res.end.bind(res),
      cacheable: true,
      content: undefined,
    }

    // append header overwrites if applicable
    // Object.keys(globalOptions.headers).forEach(function(name) {
    //   res.setHeader(name, globalOptions.headers[name])
    // })

    res.writeHead = function(...args : any) {
      // add cache control headers
    //   if (!globalOptions.headers['cache-control']) {
    //     if (shouldCacheResponse(req, res, toggle)) {
    //       res.setHeader('cache-control', 'max-age=' + (duration / 1000).toFixed(0))
    //     } else {
    //       res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
    //     }
    //   }

    //   res._apicache.headers = Object.assign({}, getSafeHeaders(res))
    res._apicache.headers = res.headers;
      return res._apicache.writeHead.apply(this, args)
    }

    // patch res.write
    res.write = (content : any, ...args : any) => {
      this.accumulateContent(res, content)
      return res._apicache.write.apply(this, [content, ...args])
    }

    var cacheObject : any;
    // patch res.end
    res.end = (content : any, encoding : any, ...args : any) =>{
    this.accumulateContent(res, content);

        // if (res._apicache.cacheable && res._apicache.content) {
          var headers = res._apicache.headers //|| getSafeHeaders(res)
          cacheObject = this.createCacheObject(
            res.statusCode,
            headers,
            res._apicache.content,
            encoding
          );
          resolve(cacheObject)
          return res._apicache.end.apply(this, [content, encoding, ...args])

        // //   cacheResponse(key, cacheObject, duration);
        // }
    }
    next();
})
  }

  private sendCachedResponse(res : any, cacheObject : any) {

    // unstringify buffers
    var data : any = cacheObject.data
    if (data && data.type === 'Buffer') {
      data =
        typeof data.data === 'number' ? Buffer.alloc(data.data) : Buffer.from(data.data)
    }

    res.writeHead(cacheObject.status || 200, this.getResponseHeaders(res))

    return res.end(data, cacheObject.encoding)
  }


private getResponseHeaders(res : any) {
    return res.getHeaders ? res.getHeaders() : res._headers
  }

private async retrieveCacheData(requestData : CacheDataType, res : any, next : any){
    let result;
    const cache : CacheDataType = await this.storage.getCache(requestData);
    if (cache.data){
        console.log("Usou Cache");
        console.log(this.getResponseHeaders(res))
        result = JSON.parse(Security.decrypt(cache.data));
        this.sendCachedResponse(res, result);
    }else {
        console.log("Sem Cache")
        console.log(this.getResponseHeaders(res))
        result = JSON.stringify(await this.makeResponseCacheable(res, next));
        requestData.data = Security.encrypt(result);
        this.storage.setCache(requestData);
    }
}

private resetCacheData(requestData : CacheDataType){
    this.storage.resetCache(requestData)
}

public async handle(req : any, res : any, next : any){
    const requestId = this.generateRequestId(req);
    const resource = this.generateResource(req);
    const requestData : CacheDataType = {_id : requestId, resource}
    const requestMethod = req.method;
    switch(requestMethod){
        case  'GET' :
            return this.retrieveCacheData(requestData, res, next);
        case  'POST' :
        case  'PUT' :
        case  'PATCH' :
        case  'DELETE' :
            this.resetCacheData(requestData);
        default:
            next();
    }
}


private verifyFramework(req : any) {
    const framework = handlers.NAMES.filter((k : any) => k == req.framework_name).pop();
    if (!framework){
        throw Error("Invalid framework! Cacher supports only this frameworks: " + handlers.NAMES);
    }
    return framework;
}
}

let cacher : any;
function config(options : any) : Cacher{
    cacher = cacher || new Cacher();
    cacher.options = options

    if (cacher.options.redis){
        cacher.storage = new RedisStorage(cacher.options.redis);
    }
    cacher.handle = cacher.handle.bind(cacher)
    return cacher;
}


export default config;
