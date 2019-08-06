let callbackAsyncHandler = {
    apply: async (t, thisArg, args) => {
        let handler = t.handler;
        let resolver = t.resolver;
        if (handler)
            await handler.apply(thisArg, args);
        if (args.length === 1) {
            resolver(args[0]);
        }
        else
            resolver(args);
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
};
export default function CBAsync(handler) {
    let target = async function (...args) {
        await callbackAsyncHandler.apply(target, this, args);
    };
    target.promise = null,
        target.resolver = null,
        target.handler = handler;
    target.promise = new Promise((resolve) => {
        target.resolver = resolve;
    });
    return new Proxy(target, callbackAsyncHandler);
};