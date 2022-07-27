export interface IStore {
	get: ( id: number ) => unknown,
	has: ( id: number ) => boolean
}

export interface IRootStore {
	[ key: string ]: IStore
}

export type ID = number | string;

export type JSONValue =
| string
| number
| boolean
| { [x: string]: JSONValue }
| Array<JSONValue>;

export interface IEntitySerialization {
	id: ID,
	[x: string]: JSONValue
}

export interface IEntity {
	id: ID,
	updateWith: ( anotherEntity: this ) => this,
	toJSON(): IEntitySerialization,
	rootStore?: IRootStore
}

export interface IEntityClass<T extends IEntity> {
	fromJSON: ( attributes: IEntitySerialization, rootStore?: IRootStore ) => T
}

export type IStoreSerialization = IEntitySerialization[];
