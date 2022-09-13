import { IRelationshipConfig } from '../../../src/relations/EntityRelationsFactory';
import { StoreEntity } from '../../../src';
import { IRootStore } from '../../../src/types';
import Item from '../Item';

export default class ConcreateWithLegacyRelationships extends StoreEntity {
	name: string;
	itemId: number;
	itemIds: number[];

	items!: Item[];
	item?: Item;

	static relationships() : IRelationshipConfig[] {
		return [
			{
				name: 'item',
				lookupKey: 'itemId',
				store: 'itemsStore',
				type: 'BELONGS_TO'
			},
			{
				name: 'items',
				lookupKey: 'itemIds',
				store: 'itemsStore',
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

	updateWith( { name }: ConcreateWithLegacyRelationships ) {
		this.name = name;

		return this;
	}
}
