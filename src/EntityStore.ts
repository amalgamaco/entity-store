import { makeAutoObservable, ObservableMap } from 'mobx';
import type {
	IRootStore, IEntity, ID, IEntityClass,
	IStoreSerialization, IEntitySerialization
} from './types';

export default class EntityStore<T extends IEntity> {
	private entityMap = new ObservableMap<ID, T>();
	private EntityKlass : IEntityClass<T>;
	private rootStore : IRootStore;
	readonly persists : boolean;

	constructor( EntityKlass : IEntityClass<T>, rootStore : IRootStore ) {
		this.EntityKlass = EntityKlass;
		this.rootStore = rootStore;
		this.persists = true;

		makeAutoObservable<EntityStore<T>, 'EntityKlass'>( this, { EntityKlass: false } );
	}

	create( attributes : IEntitySerialization ) {
		const entity = this
			.EntityKlass
			.fromJSON( attributes, this.rootStore );

		return this.add( entity );
	}

	add( entity : T ) {
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

	get( id : ID ): T | null {
		return this.entityMap.get( id ) || null;
	}

	all(): T[] {
		return Array.from( this.entityMap.values() );
	}

	where( condition: ( entity: T ) => boolean ) {
		return this.all().filter( condition );
	}

	delete( id : ID ) {
		this.entityMap.delete( id );
	}

	deleteAll( ids : ID[] ) {
		ids.forEach( entity => this.delete( entity ) );
	}

	replace( entities : T[] ) {
		this.clear();

		entities.forEach( ( entity ) => {
			this.setEntityRootStore( entity );
			this.add( entity );
		} );
	}

	clear() {
		this.entityMap.clear();
	}

	toJSON(): IStoreSerialization {
		return this.all().map( entity => entity.toJSON() );
	}

	hydrate( serialization : IStoreSerialization ) {
		serialization.forEach(
			entitySerialization => this.create( entitySerialization )
		);
	}

	// Private
	private addToStore( entity : T ) {
		this.setEntityRootStore( entity );
		this.entityMap.set( entity.id, entity );
	}

	private updateExistentWith( entity: T ): T | undefined {
		return this.get( entity.id )?.updateWith( entity ) as T | undefined;
	}

	private setEntityRootStore( entity : T ) {
		entity.rootStore = this.rootStore;
	}
}
