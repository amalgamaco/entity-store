import { makeObservable, observable, action } from 'mobx';
import { IEntity, IRootStore } from '../../src/types';
import StoreEntity from '../../src/StoreEntity';

export interface ItemSerialization {
	id: number;
	name: string
}

export default class Item extends StoreEntity implements IEntity {
	id: number;
	name: string;

	constructor( { id, name } : {id : number, name : string}, rootStore? : IRootStore ) {
		super( rootStore );

		this.id = id;
		this.name = name;

		makeObservable( this, {
			id: observable,
			name: observable,
			updateWith: action
		} );
	}

	static fromJSON( { id, name }: ItemSerialization, rootStore? : IRootStore ): Item {
		if ( !( name ) ) throw new Error( 'Invalid json' );

		return new Item( { id, name }, rootStore );
	}

	toJSON(): ItemSerialization {
		return {
			id: this.id,
			name: this.name
		};
	}

	updateWith( { id, name }: Item ): Item {
		this.id = id;
		this.name = name;

		return this;
	}
}
