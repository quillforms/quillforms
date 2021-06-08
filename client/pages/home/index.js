/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import HomeContent from './home-content';

const Home = () => {
	const { hasGetCurrentUserFinishedResolution } = useSelect( ( select ) => {
		return {
			hasGetCurrentUserFinishedResolution: select(
				'core'
			).hasFinishedResolution( 'getCurrentUser' ),
		};
	} );

	if ( ! hasGetCurrentUserFinishedResolution ) return null;
	return <HomeContent />;
};

export default Home;
