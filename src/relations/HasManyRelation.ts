import { IRelationConstructor, StoreNameType } from './types';
import { IRootStore } from '../types';

export default class HasManyRelation {
	model: Record<string, unknown[]>;
	rootStore: IRootStore;
	storeName: StoreNameType;
	lkName: string;

	constructor( {
		model, rootStore, storeName, lkName
	} : IRelationConstructor ) {
		this.model = model as Record<string, unknown[]>;
		this.rootStore = rootStore;
		this.storeName = storeName;
		this.lkName = lkName;
	}

	get relatedIds() {
		return this.model[ this.lkName ];
	}

	get store() {
		return this.rootStore ? this.rootStore[ this.storeName ] : null;
	}

	get value() {
		if ( !this.store || !this.relatedIds ) { return []; }

		return this
			.relatedIds
			.map(
				relatedId => this.store?.get( relatedId as number ) || null
			)
			.filter( related => !!related );
	}
}
