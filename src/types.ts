export type ID = number | string;

export interface IStore {
	get: ( id: ID ) => unknown,
	has: ( id: ID ) => boolean
}

export interface IRootStore {
	[ key: string ]: IStore
}

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| { [x: string]: JSONValue }
	| Array<JSONValue>;

export interface IEntitySerialization {
	id: ID,
	[x: string]: JSONValue
}

export interface IEntity {
	id: ID,
	updateWith( anotherEntity: IEntity ): IEntity,
	toJSON(): IEntitySerialization,
	rootStore?: IRootStore
}

export interface IEntityClass<T extends IEntity> {
	fromJSON: ( attributes: IEntitySerialization, rootStore?: IRootStore ) => T
}

export type IStoreSerialization = IEntitySerialization[];
