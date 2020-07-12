import { CacheDataType } from "./data.type";

export interface SetCacheFunction {
    (requestData: CacheDataType): void;
}

export  interface GetCacheFunction {
    (requestData: CacheDataType): CacheDataType;
}

export interface ResetCacheFunction {
    (requestData: CacheDataType): void;
}