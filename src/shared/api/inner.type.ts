// type ExpandNestedKeys<T, Prefix extends string> = {
//     [K in keyof T & string]: T[K] extends object
//         ? `${Prefix}${K}.${ExpandNestedKeys<T[K]>}` | `${Prefix}${K}`
//         : `${Prefix}${K}`;
// }[keyof T & string];
//
// type FunctionArguments<T> = T extends (...args: infer A) => any ? A : never;
//
// // Тип для получения составных ключей
// export type NestedKeyOf<T> = ExpandNestedKeys<T> extends infer D ? Extract<D, `${string}.${string}`> : never;
//
// export type EventParameters<T, K extends string> = K extends `${infer P}.${infer Rest}`
//     ? P extends keyof T
//         ? Rest extends NestedKeyOf<T[P]>
//             ? EventParameters<T[P], Rest>
//             : never
//         : never
//     : K extends keyof T
//       ? FunctionArguments<T[K]>
//       : never;
