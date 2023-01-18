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
	id: ID
}

export interface IEntity {
	id: ID,
	rootStore?: IRootStore

	updateWith( anotherEntity: IEntity ): IEntity,
	toJSON(): IEntitySerialization,
}

export interface IEntityRequiredAttributes {
	id: ID
}

type First<T extends any[]> = T extends [infer U, ...any[]]
	? U extends IEntityRequiredAttributes
		? U
		: never
	: never;

export type AttrsType<
	T extends new ( ...args: any ) => any
> = First<ConstructorParameters<T>>;

export interface IEntityClass<T extends IEntity, Attrs extends IEntityRequiredAttributes> {
	new( attributes: Attrs, rootStore?: IRootStore ): T
	fromJSON( attributes: IEntitySerialization, rootStore?: IRootStore ): T
}

export type IStoreSerialization = IEntitySerialization[];
