import { Storage } from '../interfaces/storage.interface';
import { CacheDataType } from '../types/data.type';

class MemoryStorage implements Storage{
    private memory_cache : any = [];

    getCache(requestData : CacheDataType): CacheDataType {
        const { _id } = requestData
        const cached : CacheDataType= this.memory_cache.filter(((cached : any) => cached._id === _id)).pop();
        return cached;
    }

    setCache (requestData : CacheDataType) : void{
        this.memory_cache.push(requestData)
    }
    resetCache (requestData : CacheDataType) : void{
        const memory_cache_new : any = [];
        this.memory_cache.forEach(((cached : any) => {
            if (cached.resource !== requestData.resource){
                memory_cache_new.push(cached);
            }
        }))
        this.memory_cache = memory_cache_new;
    }

    resetAllCache(){
        this.memory_cache = [];
    }
}

export default MemoryStorage;