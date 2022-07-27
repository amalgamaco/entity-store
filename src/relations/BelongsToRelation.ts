import { IRelationConstructor, StoreNameType } from './types';
import { IRootStore } from '../types';

export default class BelongsToRelation {
	model: Record<string, unknown>;
	rootStore: IRootStore;
	storeName: StoreNameType;
	lkName: string;

	constructor( {
		model, rootStore, storeName, lkName
	} : IRelationConstructor ) {
		this.model = model;
		this.rootStore = rootStore;
		this.storeName = storeName;
		this.lkName = lkName;
	}

	get relatedId() {
		return this.model[ this.lkName ] as number;
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
