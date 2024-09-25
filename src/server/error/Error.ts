export class Exception extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Exception';
    }
}

// export enum Error {
//   internal,
//   social_id_banned,
// }
