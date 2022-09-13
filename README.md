# Entity Store Package

A set of base classes for defining entities, stores for each entity, and relationships between them, facilitating the tasks of creating, fetching, updating and deleting them.

## EntityStore

A store for entities of a given type.

```ts
import Item from '../entities/Item';
import { rootStore } from './shared';

const itemsStore = new EntityStore( Item, rootStore );
rootStore.itemsStore = itemsStore;

const item = itemsStore.create( { id: 1, ... } );
```

## Methods

### constructor( EntityClass, rootStore ): EntityStore< EntityClass >
Creates a new store for the given `EntityClass`.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __EntityClass__ | The class of the entities that will be stored in this store. |
| __rootStore__   | The root store that saves a reference to the stores that contain the relations for the entities stored in this store. When creating a new entity using the method `create`, this root store will be automatically set to the created store entity. |

### create( attributes : IEntitySerialization )
Creates a new entity with the given attributes using the entity's `fromJSON` method. Sets the store's root store as the entity root store.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __attributes__| The attributes to create the entity with. |

### add( entity : T )
Adds a new entity to the store. If an entity with the same `id` already exists, it's updated with the passed entity by calling `updateWith` on the existing entity.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __entity__ | The entity to add to the store. |

### has( id : ID ): boolean
Returns `true` if there is an entity with the passed `id` stored in the store. Returns `false` otherwise.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __id__ | The `id` to check. |

### get( id : ID ): T | null
Returns the entity with the passed `id` or `null` if there is no entity for that `id`.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __id__ | The `id` of the entity to retrieve from the store. |

### all(): T[]
Returns a list with all the entities stored in the store.

### where( condition: ( entity: T ) => boolean ): T[]
Returns a list of all the entities stored in the store that meet the passed condition.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __condition__ | The condition to check against the entities in the store. This callback receives an entity and must return a boolean indicating if the given entity meets the condition or not. |

### delete( id : ID )
Deletes the entity with the passed `id` from the store.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __id__ | The `id` of the entity to delete. |

### deleteAll( ids : ID[] )
Deletes all the entities identified by the passed `ids` list.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __ids__ | A list of `id`s of the entities to delete. |

### replace( entities : T[] )
Replaces the stored entities with the ones passed.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __entities__ | The entities to replace the store content with. |

### clear()
Empties the store.

### toJSON(): IStoreSerialization
Serializes the store to a JSON compatible object.

### hydrate( serialization : IStoreSerialization )
Fills the store with the entities created from the serialization passed.

__Parameters__
|  Name       | Description   |
| ---         |  ---          |
| __serialization__ | The serialization that will be used to fill the store. |

## StoreEntity

A base class for entities that will be stored using an `EntityStore`.

### Relations
The are two ways to define relations between entities, one using Typescript property decorators and one using a static function defined in the Entity class. You can use the one you find more convinient for you.

#### decorators
This package provides two decorators to define properties that come from a related store: `@hasMany` and `@belongsTo`.

##### @hasMany
Specifies that the decorated property values will be retrieved from a related store.

__parameters__
|  Name       | Description   |
| ---         |  ---          |
| __storeName__ | The name of the store in the root store to retrieve the related entities from. |
| __lkName__ | The name of the property in this entity that returns the `ids` of the related entities. |

__usage__
```ts
import { StoreEntity, hasMany } from '@amalgama/entity-store';
import Comment from './Comment';

class Post extends StoreEntiy {
	// This property holds the ids of the related comments and
	// will be used to retrive the related comments from their store.
	commentIDs: number[];

	// Here we decorate the comments property with the @hasMany decorator
	// passing the name of the related entities store and the name of the
	// property that holds the releated entities ids.
	@hasMany( 'commentsStore', 'commentIDs' )
	comments!: Comment[];

	...
}
```

__IMPORTANT__: Don't forget to add the `!` at the end of the decorated property definition telling
Typescript that property will have a value (calculated by the decorator) even if we don't set a default
one.

##### @belongsTo
Specifies that the decorated property value will be retrieved from a related store.

__parameters__
|  Name       | Description   |
| ---         |  ---          |
| __storeName__ | The name of the store in the root store to retrieve the related entity from. |
| __lkName__ | The name of the property in this entity that returns the `id` of the related entity. |

__usage__
```ts
import { StoreEntity, belongsTo } from '@amalgama/entity-store';
import User from './User';

class Post extends StoreEntiy {
	// This property holds the id of the related author and
	// will be used to retrive the related author from its store.
	authorID: number[];

	// Here we decorate the author property with the @belongsTo decorator
	// passing the name of the related entity store and the name of the
	// property that holds the releated entity id.
	@belongsTo( 'usersStore', 'authorID' )
	author?: User;

	...
}
```

__IMPORTANT__: Don't forget to add the `?` at the end of the decorated property definition telling
Typescript that property may be `undefined` and that we don't need to set a default value for it.

#### relationships static method
You can also specify the entity relations using the `relationships` static method. This method must return a list of `IRelationshipConfig` items.

__IRelationshipConfig__
Each item on the `relationships` static method must meet the next interface:

```ts
export interface IRelationshipConfig {
	name: string,
	type: 'BELONGS_TO' | 'HAS_MANY',
	store: string,
	lookupKey: string,
}
```

- __name__: The name of the property that will hold the relationship.
- __type__: The type of relationship to define:
  - __BELONGS_TO__: This property will only return an `entity` whose `id` is indicated by the value of the property `lookupKey `.
  - __HAS_MANY__: This property willl return a list of `entities` whose `ids` are indicated by the value of the property `lookupKey`.
- __store__: The name of the store in the `root store` where the related entities are stored.
- __lookupKey__: The name of the property in the `entity` that holds the `id` or `ids` of the related entities.

__usage__
```ts
import { StoreEntity } from '@amalgama/entity-store';
import User from './User';
import Comment from './Comment';

class Post extends StoreEntiy {
	// This property holds the id of the related author and
	// will be used to retrive the related author from its store.
	authorID: number[];

	// This property holds the ids of the related comments and
	// will be used to retrive the related comments from their store.
	commentIDs: number[];

	author?: User;
	comments!: Comment[];


	static relationships() : IRelationshipConfig[] {
		return [
			{
				name: 'author',
				lookupKey: 'authorID',
				store: 'usersStore',
				type: 'BELONGS_TO'
			},
			{
				name: 'comments',
				lookupKey: 'commentIDs',
				store: 'commentsStore',
				type: 'HAS_MANY'
			}
		];
	}

	...
}
```

__IMPORTANT__: When declaring the properties that will return the related entities don't forget to add a `?` at the end of the property name for `BELONGS_TO` relations and a `!` at the end of the property name for `HAS_MANY` relations to prevent Typescript from asking to initialize the properties with default values.