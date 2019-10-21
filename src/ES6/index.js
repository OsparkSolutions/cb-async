var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let callbackAsyncHandler = {
    apply: (t, thisArg, args) => __awaiter(this, void 0, void 0, function* () {
        let handler = t.handler;
        let resolver = t.resolver;
        let handleOut;
        if (handler)
            handleOut = yield handler.apply(thisArg, args);
        if (args.length === 1) {
            resolver(args[0]);
        }
        else
            resolver(args);
        if (handleOut)
            return handleOut;
    }),
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
    let target = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield callbackAsyncHandler.apply(target, this, args);
        });
    };
    target.promise = null,
        target.resolver = null,
        target.handler = handler;
    target.promise = new Promise((resolve) => {
        target.resolver = resolve;
    });
    return new Proxy(target, callbackAsyncHandler);
}
;
