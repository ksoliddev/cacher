import { SetCacheFunction, GetCacheFunction, ResetCacheFunction } from "../types/functions.type";

export interface Storage {
    setCache : SetCacheFunction,
    getCache : GetCacheFunction,
    resetCache : ResetCacheFunction,
    resetAllCache : Function
}