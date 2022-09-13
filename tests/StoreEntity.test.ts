/* eslint-disable max-classes-per-file */
import { IRootStore } from '../src/types';
import EntityStore from '../src/EntityStore';
import Item from './support/Item';
import Concrete from './support/storeEnties/Concrete';
import ConcreteWithRelationships from './support/storeEnties/ConcreteWithRelationships';
import ConcreateWithLegacyRelationships from './support/storeEnties/ConcreteWithLegacyRelationships';

type ConcreteWithRelationshipsClass = typeof ConcreteWithRelationships
	| typeof ConcreateWithLegacyRelationships;

describe( 'StoreEntity', () => {
	const rootStore: IRootStore = {};
	const itemsStore = new EntityStore<Item>( Item, rootStore );
	rootStore.itemsStore = itemsStore;

	beforeEach( () => {
		itemsStore.clear();
	} );

	describe( 'when the class does not have relationships', () => {
		it( 'creates the instance normally', () => {
			const instance = new Concrete( 'concrete instance', rootStore );
			expect( instance ).toEqual( { name: 'concrete instance' } );
		} );
	} );

	const testsEntityWithRelationships = ( InstanceKlass: ConcreteWithRelationshipsClass ) => {
		describe( 'for a has many relationship', () => {
			it( 'returns the related items', () => {
				const item1 = itemsStore.create( { id: 1, name: 'Item 1' } );
				const item2 = itemsStore.create( { id: 2, name: 'Item 2' } );
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				expect( instance.items ).toEqual( [ item1, item2 ] );
			} );

			it( 'returns the related items filtering the non-existent ones', () => {
				const item1 = itemsStore.create( { id: 1, name: 'Item 1' } );
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				expect( instance.items ).toEqual( [ item1 ] );
			} );

			it( 'returns an empty list if the related store doesn\'t exists', () => {
				const instance = new InstanceKlass( 'concrete instance', {} );

				expect( instance.items ).toEqual( [] );
			} );

			it( 'returns the related items from the new store when the root store changes', () => {
				itemsStore.create( { id: 1, name: 'Item 1' } );
				itemsStore.create( { id: 2, name: 'Item 2' } );
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				const otherRootStore: IRootStore = {};
				const otherItemsStore = new EntityStore<Item>( Item, rootStore );
				otherRootStore.itemsStore = otherItemsStore;

				const item1 = otherItemsStore.create( { id: 1, name: 'Item 1 - Bis' } );
				const item2 = otherItemsStore.create( { id: 2, name: 'Item 2 - Bis' } );
				instance.rootStore = otherRootStore;

				expect( instance.items ).toEqual( [ item1, item2 ] );
			} );
		} );

		describe( 'for a belongs to relationship', () => {
			it( 'returns the related item', () => {
				const item1 = itemsStore.create( { id: 1, name: 'Item 1' } );
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				expect( instance.item ).toEqual( item1 );
			} );

			it( 'returns null if the related item doesn\'t exists in the related store', () => {
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				expect( instance.item ).toEqual( null );
			} );

			it( 'returns null if the related store doesn\'t exists', () => {
				const instance = new InstanceKlass( 'concrete instance', {} );

				expect( instance.item ).toEqual( null );
			} );

			it( 'returns the item from the new store when the root store changes', () => {
				itemsStore.create( { id: 1, name: 'Item 1' } );
				const instance = new InstanceKlass( 'concrete instance', rootStore );

				const otherRootStore: IRootStore = {};
				const otherItemsStore = new EntityStore<Item>( Item, rootStore );
				otherRootStore.itemsStore = otherItemsStore;

				const item1 = otherItemsStore.create( { id: 1, name: 'Item 1 - Other' } );
				instance.rootStore = otherRootStore;

				expect( instance.item ).toEqual( item1 );
			} );
		} );
	};

	describe( 'when the class has decorator defined relationships', () => {
		testsEntityWithRelationships( ConcreteWithRelationships );
	} );

	describe( 'when the class has legacy defined relationships', () => {
		testsEntityWithRelationships( ConcreateWithLegacyRelationships );
	} );
} );
