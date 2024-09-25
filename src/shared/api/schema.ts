type ApiClientRoot = {
    start: {
        hello(message: string): void;
        world(data: string): string;
    };
    test: {
        hi1(message: string): void;
        hi2(data: string): string;
    };
};

type ApiMethod<T> = T extends { [K in keyof T]: infer U } ? U : never;

function call<T extends keyof ApiClientRoot>(
    methodPath: `${T}.${keyof ApiMethod<ApiClientRoot[T]>}`,
    ...params: Parameters<ApiMethod<ApiClientRoot[T]>>
): ReturnType<ApiMethod<ApiClientRoot[T]>> {}

// Пример использования
const apiClientRoot: ApiClientRoot = {
    start: {
        hello: (message: string) => console.log(`Hello, ${message}!`),
        world: (data: string) => `Hello, ${data}!`,
    },
    test: {
        hi1: (message: string) => console.log(`Hi1, ${message}!`),
        hi2: (data: string) => `Hi2, ${data}!`,
    },
};

call('start.hello', '123'); // Вызывает метод hello из интерфейса start
