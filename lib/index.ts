const handlers = require('./handlers');
import Security from './security';
import { Storage } from './interfaces/storage.interface';
import MemoryStorage from './storages/memory.storage';
import { CacheDataType } from './types/data.type';
import RedisStorage from './storages/redis.storage';

class Cacher {

private options : any;
private storage : Storage = new MemoryStorage();

public config(options : any){
    this.options = options

    if (this.options.redis){
        this.storage = new RedisStorage(this.options.redis);
    }
}

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

private async retrieveCacheData(requestData : CacheDataType, res : any, next : any){
    let result;
    const cache : CacheDataType = await this.storage.getCache(requestData);
    if (cache.data){
        console.log("Usou Cache");
        result = Security.decrypt(cache.data);
        res.json(result);
    }else {
        console.log("Sem Cache")
        result = 'DADOS DE EXEMPLO';
        requestData.data = Security.encrypt(result);
        this.storage.setCache(requestData);
        setTimeout(next, 3000);
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

export default new Cacher();
