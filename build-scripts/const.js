// import path from "node:path";
//
//
// export const getDirs = (mode) => {
//
//     if(mode === 'prod') {
//         const ROOT_DIR = path.join(import.meta.dirname)
//         const SRC_DIR = path.join(ROOT_DIR, 'src')
//         const BIN_DIR = path.join(import.meta.dirname)
//         const RESOURCE_DIR = path.join(BIN_DIR, 'resources');
//         const CORE_RESOURCE_DIR = path.join(RESOURCE_DIR, 'core');
//
//         return {
//             ROOT_DIR,
//             SRC_DIR,
//             BIN_DIR,
//             RESOURCE_DIR,
//             CORE_RESOURCE_DIR
//         }
//     } else {
//         const ROOT_DIR = path.join(import.meta.dirname, '..')
//         const SRC_DIR = path.join(ROOT_DIR, 'src')
//         const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
//         const RESOURCE_DIR = path.join(BIN_DIR, 'resources');
//         const CORE_RESOURCE_DIR = path.join(RESOURCE_DIR, 'core');
//
//         return {
//             ROOT_DIR,
//             SRC_DIR,
//             BIN_DIR,
//             RESOURCE_DIR,
//             CORE_RESOURCE_DIR
//         }
//     }
//
// }
