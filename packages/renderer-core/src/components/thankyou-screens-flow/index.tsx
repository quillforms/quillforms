/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { useBlockTypes } from '../../hooks';
import DefaultThankYouScreen from '../default-thankyou-screen';

const ThankyouScreensFlow = () => {
	const blockTypes = useBlockTypes();

	const { thankyouScreens, currentBlockId } = useSelect( ( select ) => {
		return {
			thankyouScreens: select(
				'quillForms/renderer-core'
			).getThankYouScreens(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );
	return (
		<>
			{ currentBlockId === 'default_thankyou_screen' ||
			! blockTypes[ 'thankyou-screen' ]?.display ? (
				<DefaultThankYouScreen />
			) : (
				<>
					{ thankyouScreens?.length > 0 &&
						thankyouScreens.map( ( screen ) => {
							const blockType = blockTypes[ 'thankyou-screen' ];
							return (
								<blockType.display
									key={ screen.id }
									id={ screen.id }
									attributes={ screen.attributes }
								/>
							);
						} ) }
				</>
			) }
		</>
	);
};

export default ThankyouScreensFlow;
