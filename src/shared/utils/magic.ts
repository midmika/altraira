import type { interfaces } from 'inversify';

export const createInjectedClassConstructorWrapper = (target: any, context: interfaces.Context) => {
    return (...args: any[]) => {
        const tagged_props = Reflect.getMetadata('inversify:tagged', target);
        const injected_args: any[] = [];

        if (tagged_props) {
            Object.entries(tagged_props).map((_: any) => {
                const decorator: string = _[1][0].key;
                if (decorator !== 'inject') return;
                injected_args.push(context.container.get(_[1][0].value));
            });
        }

        return new target(...injected_args, ...args);
    };
};

export const createInjectedClassWrapper = (target: any, context: interfaces.Context) => {
    return (...args: any[]) => {
        const tagged_props = Reflect.getMetadata('inversify:tagged_props', target);

        const t = new target(...args);

        if (tagged_props) {
            Object.entries(tagged_props).map((_: any) => {
                const decorator: string = _[1][0].key;
                if (decorator !== 'inject') return;
                t[_[0]] = context.container.get(_[1][0].value);
            });
        }

        return t;
    };
};
