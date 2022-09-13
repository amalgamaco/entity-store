/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @enumerable property decorator that sets the enumerable property of a class field
 * to the passed value.
 * @param value true | false
 */
const enumerable = ( isEnumerable: boolean ) => (
	target: any, propertyKey: string
): void | any => {
	Object.defineProperty( target, propertyKey, {
		set( value: unknown ) {
			Object.defineProperty( this, propertyKey, {
				value,
				enumerable: isEnumerable,
				writable: true,
				configurable: true
			} );
		},
		configurable: true
	} );
};

export default enumerable;
