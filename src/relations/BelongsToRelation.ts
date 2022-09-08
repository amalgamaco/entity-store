import type {
	IRelationConstructor, StoreName, IModel, LookupKeyName
} from './types';
import type { IRootStore, ID } from '../types';

export default class BelongsToRelation {
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

	get relatedId() {
		return this.model[ this.lkName ] as ID;
	}

	get store() {
		return this.rootStore ? this.rootStore[ this.storeName ] : null;
	}

	get exists() {
		return this.store?.has( this.relatedId );
	}

	get value() {
		return this.store?.get( this.relatedId ) || null;
	}
}
