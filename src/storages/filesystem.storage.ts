import { CacheDataType } from 'types/data.type';
import { Storage } from '../interfaces/storage.interface';

class FileSystemStorage implements Storage{
    private memory_cache : any = [];

    async getCache(requestData : CacheDataType): Promise<CacheDataType> {
        const { _id } = requestData
        const cached : CacheDataType= this.memory_cache.filter(((cached : any) => cached._id === _id)).pop();
        return cached;
    }

    setCache (requestData : CacheDataType) : void{
        this.memory_cache.push(requestData)
    }

    async resetCache (requestData : CacheDataType) : Promise<void> {
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

export default FileSystemStorage;