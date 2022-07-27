import { IRootStore } from '../types';

export type StoreNameType = Exclude<keyof IRootStore, 'authStore' | 'onboardingStore'>;

export interface IRelationConstructor {
	model: Record<string, unknown | unknown[]>,
	rootStore: IRootStore,
	storeName: StoreNameType,
	lkName: string,
}
