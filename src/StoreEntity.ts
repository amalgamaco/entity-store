import EntityRelationsFactory, { IRelationshipConfig } from './relations/EntityRelationsFactory';
import type { IRootStore } from './types';
import { IRelationConstructor } from './relations/types';

export default abstract class StoreEntity {
	rootStore: IRootStore | undefined;
	private __rootStore : IRootStore | undefined;
	private __relationships : IRelationConstructor[] | undefined;

	static relationships() : IRelationshipConfig[] { return []; }
	abstract updateWith( other: StoreEntity ): StoreEntity;

	constructor( rootStore? : IRootStore ) {
		this.createNonEnumerableProperty( '__rootStore', rootStore );
		this.createNonEnumerableProperty( '__relationships', [] );

		this.createRootStoreAttribute();
		this.createRelationshipsComputedAttributes();
	}

	private createNonEnumerableProperty( propertyName : string, value : unknown ) {
		Object.defineProperty( this, propertyName, {
			enumerable: false,
			writable: true,
			value
		} );
	}

	private createRootStoreAttribute() {
		Object.defineProperty( this, 'rootStore', {
			enumerable: false,
			get: () => this.__rootStore,
			set: ( rootStore: IRootStore ) => {
				this.__rootStore = rootStore;
				this.updateRelationshipsRootStore();
			}
		} );
	}

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

		this.__relationships?.push( relation );

		Object.defineProperty( this, relationship.name, {
			enumerable: true,
			configurable: true,
			get: () => relation.value
		} );
	}

	private updateRelationshipsRootStore() {
		this.__relationships?.forEach(
			( relationship ) => { relationship.rootStore = this.__rootStore as IRootStore; }
		);
	}
}
