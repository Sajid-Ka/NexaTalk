export interface ICacheService {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;

  delete(key: string): Promise<void>;

  exists(key: string): Promise<boolean>;

  increment(key: string): Promise<number>;

  expire(key: string, seconds: number): Promise<void>;
}
