export { default as EntityStore } from './EntityStore';
export { default as StoreEntity } from './StoreEntity';
export { hasMany, belongsTo } from './decorators/relations';

export type {
	ID,
	IRootStore,
	IEntity,
	IEntityClass,
	IEntityRequiredAttributes,
	AttrsType,
	IEntitySerialization,
	IStoreSerialization,
	JSONValue
} from './types';

export type {
	IRelationshipConfig
} from './relations/EntityRelationsFactory';

export type {
	IRelationConstructor
} from './relations/types';
