export declare type CBAsync<T> = (Promise<T> & ((...args: any[]) => any));
export default function CBAsync<T = any>(handler?: (...args: any[]) => any): CBAsync<T>;
