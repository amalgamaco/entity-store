import { EntityStore } from '../src';
import Item from './support/Item';
import ItemFactory from './support/factories/ItemFactory';
import { AttrsType, IRootStore } from '../src/types';

const rootStore = 'rootStore' as unknown as IRootStore;

describe( 'EntityStore', () => {
	let store : EntityStore<Item, AttrsType<typeof Item>>;

	beforeEach( () => {
		store = new EntityStore( Item, rootStore );
	} );

	describe( 'constructor', () => {
		it( 'initializes the store with an empty collection', () => {
			expect( store.all() ).toEqual( [] );
		} );
	} );

	describe( 'add', () => {
		it( 'adds the item to the store', () => {
			const item = ItemFactory.build();
			store.add( item );

			expect( store.get( item.id ) ).toEqual( item );
		} );

		it( 'updates the item root store', () => {
			const item = ItemFactory.build();
			item.rootStore = 'previous root store' as unknown as IRootStore;

			store.add( item );

			expect( store.get( item.id )?.rootStore ).toEqual( rootStore );
		} );

		describe( 'with a previous existing item with the same id', () => {
			it( 'updates the exising item', () => {
				const item = ItemFactory.build();
				store.add( item );

				const otherItem = new Item( { id: item.id, name: 'Replacement' } );
				store.add( otherItem );

				expect( store.get( item.id ) ).toBe( item );
				expect( store.get( item.id )?.name ).toBe( otherItem.name );
			} );
		} );
	} );

	describe( 'create', () => {
		it( 'creates the entity with the given attributes and saves it in the store', () => {
			const id = 3;
			const name = 'Item 3';

			store.create( { id, name } );

			expect( store.get( id ) ).toEqual( new Item( { id, name }, rootStore ) );
		} );

		it( 'returns the created entity', () => {
			const id = 3;
			const name = 'Item 3';

			const item = store.create( { id, name } );

			expect( item ).toEqual( new Item( { id, name }, rootStore ) );
		} );

		it( 'sets the store\'s root store as the item\'s root store', () => {
			const id = 3;
			const name = 'Item 3';

			const item = store.create( { id, name } );

			expect( item?.rootStore ).toEqual( rootStore );
		} );

		describe( 'with a previous existing item with the same id', () => {
			it( 'updates the exising item', () => {
				const item = ItemFactory.build();
				store.add( item );

				store.create( { id: item.id, name: 'Replacement' } );

				expect( store.get( item.id ) ).toBe( item );
				expect( store.get( item.id )?.name ).toBe( 'Replacement' );
			} );
		} );
	} );

	describe( 'delete', () => {
		it( 'deletes the entity with the matching id', () => {
			const item = ItemFactory.build( { id: 99 } );
			const items = ItemFactory.buildList( 5 );

			store.replace( [ ...items, item ] );

			store.delete( 99 );

			expect( store.get( 99 ) ).toBeNull();
		} );
	} );

	describe( 'deleteAll', () => {
		it( 'deletes the entity with the matching id', () => {
			const itemsToDelete = [
				ItemFactory.build( { id: 98 } ),
				ItemFactory.build( { id: 99 } )
			];
			const items = ItemFactory.buildList( 5 );

			store.replace( [ ...items, ...itemsToDelete ] );

			store.deleteAll( [ 98, 99 ] );

			expect( store.get( 98 ) ).toBeNull();
			expect( store.get( 99 ) ).toBeNull();
		} );
	} );

	describe( 'get', () => {
		describe( 'when there is an item with the passed id in the store', () => {
			it( 'returns the item', () => {
				const item = ItemFactory.build();
				store.add( item );

				expect( store.get( item.id ) ).toEqual( item );
			} );
		} );

		describe( 'when there is not item in the store with the passed id', () => {
			it( 'returns null', () => {
				expect( store.get( 3 ) ).toEqual( null );
			} );
		} );
	} );

	describe( 'all', () => {
		describe( 'when there are no items stored', () => {
			it( 'returns an empty array', () => {
				expect( store.all() ).toEqual( [] );
			} );
		} );

		describe( 'when there are items stored', () => {
			const entities = ItemFactory.buildList( 2 );

			beforeEach( () => {
				store.replace( entities );
			} );

			it( 'returns them', () => {
				expect( store.all() ).toEqual( entities );
			} );
		} );
	} );

	describe( 'where', () => {
		const entities = ItemFactory.buildList( 2 );

		beforeEach( () => {
			store.replace( entities );
		} );

		it( 'returns the elements matching the provided condition', () => {
			expect( store.where( item => item.id === entities[ 0 ].id ) ).toEqual( [ entities[ 0 ] ] );
		} );
	} );

	describe( 'replace', () => {
		const newItems = ItemFactory.buildList( 3, {}, { transient: { startsAt: 4 } } );

		it( 'sets the entities to the store', () => {
			store.replace( newItems );
			expect( store.all() ).toEqual( newItems );
		} );

		it( 'replaces the current entities in the store', () => {
			const initialItems = ItemFactory.buildList( 2 );

			store.replace( initialItems );
			expect( store.all() ).toEqual( initialItems );

			store.replace( newItems );
			expect( store.all() ).toEqual( newItems );
		} );
	} );

	describe( 'clear', () => {
		it( 'removes all items from the store', () => {
			const items = ItemFactory.buildList( 5 );
			items.forEach( item => store.add( item ) );
			store.clear();

			expect( store.all() ).toEqual( [] );
		} );
	} );

	describe( 'serialize', () => {
		it( 'returns the serialized entities', () => {
			const items = ItemFactory.buildList( 2 );
			store.replace( items );

			const result = store.serialize();

			expect( result ).toEqual( items.map( item => item.toJSON() ) );
		} );
	} );

	describe( 'hydrate', () => {
		it( 'hydrates the store with the entities from the provided serialization', () => {
			const items = ItemFactory.buildList( 2 );
			const serialization = items.map( item => item.toJSON() );

			store.hydrate( serialization );

			expect( store.all() ).toEqual( items );
		} );
	} );
} );
