import { CacheDataType } from "./data.type";

export interface SetCacheFunction {
    (requestData: CacheDataType): void;
}

export  interface GetCacheFunction {
    (requestData: CacheDataType): Promise<CacheDataType>;
}

export interface ResetCacheFunction {
    (requestData: CacheDataType): Promise<void>;
}