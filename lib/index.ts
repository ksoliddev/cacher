const handlers = require('./handlers');
import Security from './security';
import Storage from './interfaces/storage.interface';
import MemoryStorage from './storages/memory.storage';
import { CacheDataType } from './types/data.type';

class Cacher {

private options : any;
private storage : Storage = new MemoryStorage();

public config(options : any){
    this.options = options
}

private generateRequestId(req : any) : string{
    const {originalUrl} = req;
    console.log("originalUrl: ", originalUrl);
    return Security.encrypt(originalUrl);
}

private generateResource(req : any) : string{
    const {originalUrl} = req;
    const array = originalUrl.split('/');
    const resource = array[1];
    console.log("resource: ", resource);
    return Security.encrypt(resource);
}

private getRequestId(req : any) : string{
    const {url} = req;
    return Security.decrypt(url);
}

private retrieveData(requestData : CacheDataType, res : any, next : any){
    let result;
    const cache : CacheDataType = this.storage.getCache(requestData);
    if (cache){
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

private resetData(requestData : CacheDataType){
    this.storage.resetCache(requestData)
}

public async handle(req : any, res : any, next : any){
    const requestId = this.generateRequestId(req);
    const resource = this.generateResource(req);
    const requestData : CacheDataType = {_id : requestId, resource}
    const requestMethod = req.method;
    switch(requestMethod){
        case  'GET' :
            return this.retrieveData(requestData, res, next);
        case  'POST' :
        case  'PUT' :
        case  'DELETE' :
            this.resetData(requestData);
            next();
            break;
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
