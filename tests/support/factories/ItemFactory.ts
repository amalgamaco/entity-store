import { Factory } from 'fishery';
import Item from '../Item';

export default Factory.define<Item>( (
	{ sequence, params: { id }, transientParams: { startsAt = 1 } }
) => {
	const itemId = id || sequence + startsAt;
	const itemName = `Item - ${itemId}`;

	return new Item( { id: itemId, name: itemName } );
} );
