export function DontCheckCharacter(): any {
    return function (target: any, propertyKey: string) {
        if (!Reflect.hasMetadata('dont_check_character', target.constructor)) {
            Reflect.defineMetadata('dont_check_character', [], target.constructor);
        }
        const list = Reflect.getMetadata('dont_check_character', target.constructor);
        list.push(propertyKey);
        Reflect.defineMetadata('dont_check_character', list, target.constructor);
    };
}

export function ControllerRpc(name: string): any {
    return function (target: any, propertyKey: string) {
        if (!Reflect.hasMetadata('rpcs', target.constructor)) {
            Reflect.defineMetadata('rpcs', [], target.constructor);
        }
        const routes = Reflect.getMetadata('rpcs', target.constructor);
        routes.push(propertyKey);
        Reflect.defineMetadata('rpcs', routes, target.constructor);
        Reflect.defineMetadata('method', name, target.constructor);
    };
}

export function ControllerEvent(name: string): any {
    return function (target: any, propertyKey: string) {
        if (!Reflect.hasMetadata('events', target.constructor)) {
            Reflect.defineMetadata('events', [], target.constructor);
        }
        const routes = Reflect.getMetadata('events', target.constructor);
        routes.push(propertyKey);
        Reflect.defineMetadata('events', routes, target.constructor);
        Reflect.defineMetadata('method', name, target.constructor);
    };
}

export function Controller<T extends new (...args: any[]) => any>(name: string): any {
    return function (target: T): void {
        Reflect.defineMetadata('prefix', name, target);
        if (!Reflect.hasMetadata('rpcs', target)) {
            Reflect.defineMetadata('rpcs', [], target);
        }

        if (!Reflect.hasMetadata('events', target)) {
            Reflect.defineMetadata('events', [], target);
        }
    };
}
