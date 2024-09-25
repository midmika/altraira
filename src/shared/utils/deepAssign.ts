export function deepAssign<T>(target: T, ...sources: any[]): T {
    if (!sources.length) return target;

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepAssign(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepAssign(target, ...sources);
}

function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item);
}
