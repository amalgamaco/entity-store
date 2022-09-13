import { StoreEntity } from '../../../src';
import { IRootStore } from '../../../src/types';

export default class Concrete extends StoreEntity {
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
