let callbackAsyncHandler = {
    apply: async (t, thisArg, args) => {
        let handler: Function = t.handler;
        let resolver: Function = t.resolver;

        let handleOut;
        if (handler)
            handleOut = await handler.apply(thisArg, args);

        if (args.length === 1) {
            resolver(args[0]);
        }
        else resolver(args)

        if (handleOut)
            return handleOut;

    },
    get: (target, prop) => {
        if (prop == 'then' || prop == 'catch') {
            return target.promise[prop].bind(target.promise);
        }
        else {
            let value = target[prop];
            return typeof value == 'function' ? value.bind(target) : value;
        }
    }
}

export type CBAsync<T> = (Promise<T> & ((...args: any[]) => any));

export default function CBAsync<T = any>(handler?:(...args: any[]) => any): CBAsync<T> {
    let target: any = async function (...args) {
        await callbackAsyncHandler.apply(target, this, args);
    };
    target.promise = null,
        target.resolver = null,
        target.handler = handler

    target.promise = new Promise((resolve) => {
        target.resolver = resolve;
    });
    return new Proxy(target, callbackAsyncHandler)
};