import { Storage } from '../interfaces/storage.interface';
import { CacheDataType } from '../types/data.type';
const { promisify } = require("util");


class MongoStorage implements Storage{
    private redisClient : any;
    constructor(redisClient : any) {
        this.redisClient = redisClient;
    }

    async getCache(requestData : CacheDataType): Promise<CacheDataType> {
        console.log("getCache");
        const HGETALL = promisify(this.redisClient.HGETALL).bind(this.redisClient);
        const { _id } = requestData
        const cached : CacheDataType = {_id};
        const dados = await HGETALL(_id);
        if (dados){
            cached.data = dados.response;
        }

        return cached;
    }

    setCache (requestData : CacheDataType) : void{
        console.log("setCache");
        const {_id, data, resource} = requestData;
        const fields = ["response", data, "queried_at", new Date()];
        this.redisClient.hmset(_id, fields);
        if (resource){
            this.redisClient.SADD(resource, _id);
        }
    }
    async resetCache (requestData : CacheDataType) : Promise<void> {
        console.log("resetCache");
        const SMEMBERS = promisify(this.redisClient.SMEMBERS).bind(this.redisClient);
        const queries = await SMEMBERS(requestData.resource);
        queries.forEach((query : any)=>{
                this.redisClient.del(query);
        });
        this.redisClient.del(requestData.resource);
    }

    //TODO através da lista de resources do mesmo APP_ID
    resetAllCache(){
        this.redisClient.removeAll();
    }
}

export default MongoStorage;