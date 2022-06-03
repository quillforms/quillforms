/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { useBlockTypes } from '../../hooks';
import DefaultThankYouScreen from '../default-thankyou-screen';

const ThankyouScreensWrapper = () => {
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

	const currentThankYouScreen = thankyouScreens.find(
		( screen ) => screen.id === currentBlockId
	);
	const blockType = blockTypes[ 'thankyou-screen' ];

	return (
		<>
			{ currentBlockId === 'default_thankyou_screen' ||
			! blockTypes[ 'thankyou-screen' ]?.display ? (
				<DefaultThankYouScreen />
			) : (
				// @ts-expect-error
				<blockType.display
					key={ currentThankYouScreen?.id }
					id={ currentThankYouScreen?.id }
					attributes={ currentThankYouScreen?.attributes }
				/>
			) }
		</>
	);
};

export default ThankyouScreensWrapper;
