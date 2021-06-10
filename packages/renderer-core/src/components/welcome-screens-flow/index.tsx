/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { useBlockTypes } from '../../hooks';
const WelcomeScreensFlow = () => {
	const blockTypes = useBlockTypes();

	const { welcomeScreens, currentBlockId } = useSelect( ( select ) => {
		return {
			welcomeScreens: select(
				'quillForms/renderer-core'
			).getWelcomeScreens(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );

	const { goNext } = useDispatch( 'quillForms/renderer-core' );
	return (
		<>
			{ welcomeScreens?.length > 0 &&
				welcomeScreens.map( ( screen ) => {
					const blockType = blockTypes[ 'welcome-screen' ];
					return (
						<blockType.display
							next={ goNext }
							isActive={ currentBlockId === screen.id }
							key={ screen.id }
							id={ screen.id }
							attributes={ screen.attributes }
						/>
					);
				} ) }
		</>
	);
};

export default WelcomeScreensFlow;
