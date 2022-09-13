/* eslint-disable @typescript-eslint/no-explicit-any */
import BelongsToRelation from '../relations/BelongsToRelation';
import HasManyRelation from '../relations/HasManyRelation';
import { IModel } from '../relations/types';
import StoreEntity from '../StoreEntity';
import { IRootStore } from '../types';

/**
 * @hasMany property decorator that defines that the property is calculated
* retrieving the result objects from a related store.
 * @param storeName The name of the store to retrieve the related values from.
 * @param lkName The name of the property in the target object that holds the
 * related object ids.
 */
export const hasMany = ( storeName: string, lkName: string ): any => (
	target: any, propertyKey: string
): any | void => {
	Object.defineProperty( target, propertyKey, {
		get() {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const self = this! as StoreEntity;

			const rootStore = self.rootStore as IRootStore;
			const model = ( self as unknown ) as IModel;

			const relation = new HasManyRelation( {
				model,
				rootStore,
				storeName,
				lkName
			} );

			return relation.value;
		},
		enumerable: true,
		configurable: true
	} );
};

/**
 * @belongsTo property decorator that defines that the property is calculated
* retrieving the result object from a related store.
 * @param storeName The name of the store to retrieve the related value from.
 * @param lkName The name of the property in the target object that holds the
 * related object id.
 */
export const belongsTo = ( storeName: string, lkName: string ): any => (
	target: any, propertyKey: string
): any | void => {
	Object.defineProperty( target, propertyKey, {
		get() {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const self = this! as StoreEntity;

			const rootStore = self.rootStore as IRootStore;
			const model = ( self as unknown ) as IModel;

			const relation = new BelongsToRelation( {
				model,
				rootStore,
				storeName,
				lkName
			} );

			return relation.value;
		},
		enumerable: true,
		configurable: true
	} );
};
