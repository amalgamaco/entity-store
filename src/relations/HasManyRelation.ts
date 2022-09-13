import type {
	IRelationConstructor, StoreName, IModel, LookupKeyName
} from './types';
import type { IRootStore, ID } from '../types';

export default class HasManyRelation {
	model: IModel;
	rootStore: IRootStore;
	storeName: StoreName;
	lkName: LookupKeyName;

	constructor( {
		model, rootStore, storeName, lkName
	} : IRelationConstructor ) {
		this.model = model;
		this.rootStore = rootStore;
		this.storeName = storeName;
		this.lkName = lkName;
	}

	get relatedIds() {
		return this.model[ this.lkName ] as ID[];
	}

	get store() {
		return this.rootStore ? this.rootStore[ this.storeName ] : null;
	}

	get value() {
		if ( !this.store || !this.relatedIds ) { return []; }

		return this
			.relatedIds
			.map(
				relatedId => this.store?.get( relatedId ) || null
			)
			.filter( related => !!related );
	}
}
