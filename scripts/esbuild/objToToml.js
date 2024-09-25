const getStr = (key, value) => {
    const type = typeof value;

    let res = '';

    if (type === 'boolean') {
        res += `\n${key} = ${value}`;
    } else if (type === 'string') {
        res += `\n${key} = '${value}'`;
    } else if (type === 'number') {
        res += `\n${key} = ${value}`;
    } else if (Array.isArray(value)) {
        res += '\n' + key + ' = ' + '[' + value.map((i) => "'" + i + "'").join(', ') + ']';
    } else if (type === 'object') {
        res +=
            '\n' +
            `[${key}]` +
            Object.entries(value)
                .map(([key, value]) => getStr(key, value))
                .join('');
    }

    return res;
};

export const objToToml = (obj) => {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => {
            acc += getStr(key, value);
            return acc;
        }, '')
        .slice(1);
};
