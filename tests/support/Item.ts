import { makeObservable, observable, action } from 'mobx';
import { IRootStore } from '../../src/types';
import StoreEntity from '../../src/StoreEntity';

export default class Item extends StoreEntity {
	id: number;
	name: string;

	constructor( { id, name } : {id : number, name : string}, rootStore? : IRootStore ) {
		super( rootStore );

		this.id = id;
		this.name = name;

		makeObservable( this, {
			id: observable,
			name: observable,
			update: action,
		} );
	}

	static fromJSON( json : {id? : number, name? : string}, rootStore? : IRootStore ) {
		const { id, name } = json;
		if ( !( id && name ) ) throw new Error( 'Invalid json' );

		return new Item( { id, name }, rootStore );
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
		};
	}

	update( { id, name } : Record<string, unknown> ) {
		this.id = id as number;
		this.name = name as string;
	}
}
