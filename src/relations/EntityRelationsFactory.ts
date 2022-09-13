import BelongsToRelation from './BelongsToRelation';
import HasManyRelation from './HasManyRelation';

import type { IRootStore } from '../types';
import type { IModel, StoreName } from './types';

const RELATION_CLASS_BY_TYPE = Object.freeze( {
	BELONGS_TO: BelongsToRelation,
	HAS_MANY: HasManyRelation
} );

export interface IRelationshipConfig {
	name: string,
	type: keyof typeof RELATION_CLASS_BY_TYPE,
	store: StoreName,
	lookupKey: string,
}

interface Constructor {
	model: IModel,
	rootStore: IRootStore,
	config: IRelationshipConfig
}

export default class EntityRelationsFactory {
	static relationFor( {
		model,
		rootStore,
		config: {
			type,
			store: storeName,
			lookupKey: lkName
		}
	} : Constructor ) {
		const RelationClass = EntityRelationsFactory
			.relationClassForType( type );

		return new RelationClass( {
			model, rootStore, storeName, lkName
		} );
	}

	static relationClassForType( type: keyof typeof RELATION_CLASS_BY_TYPE ) {
		return RELATION_CLASS_BY_TYPE[ type ];
	}
}
