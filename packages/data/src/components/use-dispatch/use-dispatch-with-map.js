/**
 * External dependencies
 */
import { mapValues } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useRegistry from '../registry-provider/use-registry';

function proxyDispatch( propName, registry, ...args ) {
	this( registry.dispatch, registry )[ propName ]( ...args );
}

const useDispatchWithMap = ( dispatchMap ) => {
	const registry = useRegistry();
	const currentDispatchProps = dispatchMap( registry.dispatch, registry );
	return useMemo( () => mapValues(
		currentDispatchProps,
		( dispatcher, propName ) => {
			if ( typeof dispatcher !== 'function' ) {
				// eslint-disable-next-line no-console
				console.warn(
					`Property ${ propName } returned from dispatchMap in useDispatchWithMap must be a function.`
				);
			}
			return proxyDispatch.bind( dispatchMap, propName, registry );
		}
	), [ dispatchMap ] );
};

export default useDispatchWithMap;
