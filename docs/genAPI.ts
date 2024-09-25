// import 'reflect-metadata';
// import ts from 'typescript';
// import path from 'node:path';
//
// function findClasses(node: ts.Node): ts.ClassDeclaration[] {
//     const classes: ts.ClassDeclaration[] = [];
//
//     function visit(node: ts.Node) {
//         if (ts.isClassDeclaration(node)) {
//             classes.push(node);
//         }
//         ts.forEachChild(node, visit);
//     }
//
//     visit(node);
//     return classes;
// }
//
// interface MethodParameter {
//     name: string;
//     type: string;
//     children?: MethodParameter[];
// }
//
// const fileName = path.resolve('src', 'server', 'controllers', 'StartController.ts');
// const program = ts.createProgram([fileName], {});
// const sourceFile = program.getSourceFile(fileName);
//
// function isClassMethod(node: ts.Node): node is ts.MethodDeclaration {
//     return ts.isMethodDeclaration(node) && !node.body?.statements.some(ts.isThrowStatement);
// }
//
// // Рекурсивная функция для получения строкового представления типа
// function getTypeString(type: ts.Type, typeChecker: ts.TypeChecker, processedInterfaces: Map<string, string>): string {
//     if (type.isClassOrInterface()) {
//         const symbol = type.getSymbol();
//         if (symbol) {
//             const declarations = symbol.getDeclarations();
//             if (declarations && declarations.length > 0) {
//                 const declaration = declarations[0];
//                 if (ts.isInterfaceDeclaration(declaration)) {
//                     return getInterfaceString(declaration, typeChecker, processedInterfaces);
//                 }
//             }
//         }
//     }
//     return typeChecker.typeToString(
//         type,
//         undefined,
//         ts.TypeFormatFlags.UseFullyQualifiedType | ts.TypeFormatFlags.NoTruncation,
//     );
// }
//
// // Функция для получения строкового представления интерфейса
// function getInterfaceString(
//     interfaceDeclaration: ts.InterfaceDeclaration,
//     typeChecker: ts.TypeChecker,
//     processedInterfaces: Map<string, string>,
// ): string {
//     const interfaceName = interfaceDeclaration.name.escapedText;
//     if (processedInterfaces.has(interfaceName)) {
//         return interfaceName;
//     }
//
//     let interfaceString = `interface ${interfaceName} {\n`;
//
//     interfaceDeclaration.members.forEach((member) => {
//         if (ts.isPropertySignature(member) && member.type) {
//             const memberName = member.name.escapedText;
//             const memberType = typeChecker.getTypeAtLocation(member);
//             const memberTypeString = getTypeString(memberType, typeChecker, processedInterfaces);
//             interfaceString += `  ${memberName}: ${memberTypeString};\n`;
//         }
//     });
//
//     interfaceString += '}';
//     processedInterfaces.set(interfaceName, interfaceString);
//     return interfaceName;
// }
//
// function generateInterfaceString(parameter: MethodParameter, indentation: string = ''): string {
//     let interfaceString = '';
//
//     if (parameter.children && parameter.children.length > 0) {
//         interfaceString += `${indentation}${parameter.name}: {\n`;
//         for (const child of parameter.children) {
//             interfaceString += generateInterfaceString(child, `${indentation}    `);
//         }
//         interfaceString += `${indentation}},\n`;
//     } else {
//         interfaceString += `${indentation}${parameter.name}: ${parameter.type},\n`;
//     }
//
//     return interfaceString;
// }
//
// const typeChecker = program.getTypeChecker();
// // Поиск и печать информации о классах в файле
//
// function extractChildren(type: ts.Type) {
//     if (!type.symbol) return undefined;
//
//     const members = type.getProperties();
//     if (members.length === 0) return undefined;
//
//     return members.map((member) => {
//         const memberType = typeChecker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!);
//         const memberTypeStr = typeChecker.typeToString(memberType);
//         const children = extractChildren(memberType);
//         return { name: member.name, type: memberTypeStr, children };
//     });
// }
//
// const createInterface = (item) => {
//     console.log('item', item);
//     console.log('head:', `[${item.name}]`);
//     if (!item.children) return item.name + ': ' + item.type;
//     for (const child of item.children) {
//         const c = createInterface(child);
//         console.log('c', c);
//     }
// };
//
// if (!sourceFile) {
//     console.log('source file doesnt exists');
//     process.exit(1);
// }
//
// const classes = findClasses(sourceFile);
// const controller = classes[0];
// console.log('class name', controller.name?.escapedText);
//
// function extractParameter(param: ts.ParameterDeclaration): MethodParameter {
//     const paramName = param.name.getText();
//     const paramType = param.type ? typeChecker.getTypeAtLocation(param.type) : undefined;
//     const paramTypeStr = paramType ? typeChecker.typeToString(paramType) : 'any';
//     const children = paramType ? extractChildren(paramType) : undefined;
//
//     return { name: paramName, type: paramTypeStr, children };
// }
//
// for (const item of controller.members) {
//     if (!isClassMethod(item)) continue;
//     let rpcOrEventDecoratorName = '';
//
//     item?.modifiers?.forEach((decorator) => {
//         if (!ts.isDecorator(decorator)) return;
//         const dec = decorator?.expression?.expression.escapedText;
//         if (dec === 'ControllerRpc') {
//             rpcOrEventDecoratorName = 'rpc';
//         } else if (dec === 'ControllerEvent') {
//             rpcOrEventDecoratorName = 'event';
//         }
//     });
//
//     if (!rpcOrEventDecoratorName) continue;
//
//     console.log(`[${rpcOrEventDecoratorName.toUpperCase()}]`, item.name?.escapedText);
//
//     item.parameters.forEach((parameter) => {
//         if (parameter.type?.typeName?.escapedText === 'Character') return;
//
//         if (parameter.type) {
//             // Получение текстового представления типа параметра
//             const typeText = sourceFile.text.substring(parameter.type.pos, parameter.type.end).trim();
//             const optionalText = parameter.questionToken ? ' (?)' : '';
//             console.log(`  ${parameter.name.escapedText}: ${typeText}${optionalText}`);
//             console.log('=======================');
//             console.log(generateInterfaceString(extractParameter(parameter)));
//             console.log('=======================');
//         } else {
//             console.log('  Parameter has no type specified');
//         }
//
//         // console.log(getTypeText(parameter, typeChecker, processedInterfaces));
//
//         // if (parameter.type && ts.isTypeReferenceNode(parameter.type)) {
//         //     const referencedInterfaceName = parameter.type.typeName.escapedText;
//         //     console.log('referencedInterfaceName', parameter.type.typeName.escapedText);
//         //     // const referencedInterface = findInterface(program, referencedInterfaceName);
//         //     // if (referencedInterface) {
//         //     //     console.log('  Referenced interface:', referencedInterface.escapedText);
//         //     //     // Здесь можно дополнительно обработать информацию о найденном интерфейсе
//         //     // } else {
//         //     //     console.log(`  Interface '${referencedInterfaceName}' not found`);
//         //     // }
//         //
//         // } else {
//         //     console.log('  Parameter has no type specified');
//         // }
//     });
// }
