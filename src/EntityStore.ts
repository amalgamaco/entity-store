import { makeAutoObservable, ObservableMap } from 'mobx';
import type {
	IRootStore, IEntity, ID, IEntityClass,
	IStoreSerialization, IEntityRequiredAttributes
} from './types';

export default class EntityStore<
	Entity extends IEntity,
	EntityAttrs extends IEntityRequiredAttributes
> {
	private entityMap = new ObservableMap<ID, Entity>();

	private EntityKlass : IEntityClass<Entity, EntityAttrs>;
	private rootStore : IRootStore;
	readonly persists : boolean;

	constructor( EntityKlass : IEntityClass<Entity, EntityAttrs>, rootStore : IRootStore ) {
		this.EntityKlass = EntityKlass;
		this.rootStore = rootStore;
		this.persists = true;

		makeAutoObservable<EntityStore<Entity, EntityAttrs>, 'EntityKlass'>( this, { EntityKlass: false } );
	}

	create( attributes : EntityAttrs ) {
		const entity = new this
			.EntityKlass( attributes, this.rootStore );

		return this.add( entity );
	}

	add( entity : Entity ) {
		if ( this.has( entity.id ) ) {
			this.updateExistentWith( entity );
		} else {
			this.addToStore( entity );
		}

		return this.get( entity.id );
	}

	has( id : ID ): boolean {
		return this.entityMap.has( id );
	}

	get( id : ID ): Entity | null {
		return this.entityMap.get( id ) || null;
	}

	all(): Entity[] {
		return Array.from( this.entityMap.values() );
	}

	where( condition: ( entity: Entity ) => boolean ) {
		return this.all().filter( condition );
	}

	delete( id : ID ) {
		this.entityMap.delete( id );
	}

	deleteAll( ids : ID[] ) {
		ids.forEach( entity => this.delete( entity ) );
	}

	replace( entities : Entity[] ) {
		this.clear();

		entities.forEach( ( entity ) => {
			this.setEntityRootStore( entity );
			this.add( entity );
		} );
	}

	clear() {
		this.entityMap.clear();
	}

	serialize(): IStoreSerialization {
		return this.all().map( entity => entity.toJSON() );
	}

	hydrate( serialization : IStoreSerialization ) {
		this.replace(
			serialization.map(
				entitySerialization => this
					.EntityKlass
					.fromJSON( entitySerialization, this.rootStore )
			)
		);
	}

	// Private
	private addToStore( entity : Entity ) {
		this.setEntityRootStore( entity );
		this.entityMap.set( entity.id, entity );
	}

	private updateExistentWith( entity: Entity ): Entity | undefined {
		return this.get( entity.id )?.updateWith( entity ) as Entity | undefined;
	}

	private setEntityRootStore( entity : Entity ) {
		entity.rootStore = this.rootStore;
	}
}
