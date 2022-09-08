/* eslint-disable max-classes-per-file */
import StoreEntity from '../src/StoreEntity';
import { IRootStore } from '../src/types';
import { IRelationshipConfig } from '../src/relations/EntityRelationsFactory';
import { StoreName } from '../src/relations/types';
import EntityStore from '../src/EntityStore';
import Item from './support/Item';

class Concrete extends StoreEntity {
	name: string;

	constructor( name: string, rootStore : IRootStore ) {
		super( rootStore );
		this.name = name;
	}

	updateWith( { name }: Concrete ) {
		this.name = name;

		return this;
	}
}

class ConcreteWithRelationships extends StoreEntity {
	name: string;
	itemId: number;
	itemIds: number[];

	static relationships() : IRelationshipConfig[] {
		return [
			{
				name: 'item',
				lookupKey: 'itemId',
				store: 'itemStore' as StoreName,
				type: 'BELONGS_TO'
			},
			{
				name: 'items',
				lookupKey: 'itemIds',
				store: 'itemStore' as StoreName,
				type: 'HAS_MANY'
			}
		];
	}

	constructor( name: string, rootStore : IRootStore ) {
		super( rootStore );
		this.name = name;
		this.itemId = 1;
		this.itemIds = [ 1, 2 ];
	}

	updateWith( { name }: ConcreteWithRelationships ) {
		this.name = name;

		return this;
	}
}

describe( 'StoreEntity', () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const itemStore = new EntityStore<Item>( Item, this );

	const rootStore = {
		itemStore
	} as unknown as IRootStore;

	describe( 'when the class does not have relationships', () => {
		it( 'creates the instance normally', () => {
			const instance = new Concrete( 'concrete instance', rootStore );
			expect( instance ).toEqual( { name: 'concrete instance' } );
		} );
	} );

	describe( 'when the class has relationships', () => {
		it( 'creates the instance with the corresponding getters', () => {
			const item = itemStore.create( { id: 1, name: 'Item 1' } );

			const instance = new ConcreteWithRelationships( 'concrete instance', rootStore );
			expect( instance ).toEqual( {
				name: 'concrete instance',
				itemId: 1,
				item,
				itemIds: [ 1, 2 ],
				items: [ item ]
			} );
		} );
	} );
} );
