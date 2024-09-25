export class AbstractEntity<T> {
    protected readonly _id: T;

    protected constructor(id: T) {
        this._id = id
    }

    public get id(): T {
        return this._id;
    }

    equals(entity: AbstractEntity<T>): boolean {
        return entity.id === this.id;
    }

}