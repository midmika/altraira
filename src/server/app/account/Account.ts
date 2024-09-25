export class Account {
    private readonly _id: number;
    private readonly _social_id: string;
    private readonly _social_name: string;

    constructor(dto: IAccountDto) {
        this._id = dto.id;
        this._social_id = dto.social_id;
        this._social_name = dto.social_name;
    }

    get id(): number {
        return this._id;
    }

    get social_id(): string {
        return this._social_id;
    }

    get social_name(): string {
        return this._social_name;
    }
}

export interface IAccountDto {
    id: number;
    social_id: string;
    social_name: string;
}

export interface IAccountCreateDto {
    social_id: string;
    social_name: string;
}
