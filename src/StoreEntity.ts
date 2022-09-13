import EntityRelationsFactory, { IRelationshipConfig } from './relations/EntityRelationsFactory';
import type { IRootStore } from './types';
import BelongsToRelation from './relations/BelongsToRelation';
import HasManyRelation from './relations/HasManyRelation';
import enumerable from './decorators/enumerable';

export default abstract class StoreEntity {
	@enumerable( false )
	private __rootStore: IRootStore | undefined;

	@enumerable( false )
	private __relationships: ( BelongsToRelation | HasManyRelation )[];

	static relationships() : IRelationshipConfig[] { return []; }
	abstract updateWith( other: StoreEntity ): StoreEntity;

	constructor( rootStore? : IRootStore ) {
		this.__rootStore = rootStore;
		this.__relationships = [];

		this.createRelationshipsComputedAttributes();
	}

	get rootStore(): IRootStore | undefined { return this.__rootStore; }
	set rootStore( newRootStore: IRootStore | undefined ) {
		this.__rootStore = newRootStore;
		this.updateRelationshipsRootStore();
	}

	// Private
	private createRelationshipsComputedAttributes() {
		( this.constructor as typeof StoreEntity )
			.relationships()
			.forEach(
				relationship => this.createRelationshipComputedAttribute( relationship )
			);
	}

	private createRelationshipComputedAttribute( relationship : IRelationshipConfig ) {
		const relation = EntityRelationsFactory.relationFor( {
			model: this as Record<string, unknown>,
			rootStore: this.rootStore as IRootStore,
			config: relationship
		} );

		this.__relationships.push( relation );

		Object.defineProperty( this, relationship.name, {
			enumerable: true,
			configurable: true,
			get: () => relation.value
		} );
	}

	private updateRelationshipsRootStore() {
		this.__relationships.forEach(
			( relationship ) => { relationship.rootStore = this.__rootStore as IRootStore; }
		);
	}
}
