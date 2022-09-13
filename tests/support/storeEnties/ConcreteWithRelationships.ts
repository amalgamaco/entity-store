import { belongsTo, hasMany } from '../../../src/decorators/relations';
import { StoreEntity } from '../../../src';
import { IRootStore } from '../../../src/types';
import Item from '../Item';

export default class ConcreteWithRelationships extends StoreEntity {
	name: string;
	itemId: number;
	itemIds: number[];

	@hasMany( 'itemsStore', 'itemIds' )
		items!: Item[];

	@belongsTo( 'itemsStore', 'itemId' )
		item!: Item | undefined;

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
