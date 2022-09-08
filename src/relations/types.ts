import { IRootStore } from '../types';

export type StoreName = string;
export type LookupKeyName = string;
export type IModel = Record<string, unknown | unknown[]>;

export interface IRelationConstructor {
	model: IModel,
	rootStore: IRootStore,
	storeName: StoreName,
	lkName: LookupKeyName,
}
