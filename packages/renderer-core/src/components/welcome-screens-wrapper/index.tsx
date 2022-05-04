/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * Internal Dependencies
 */
import { useBlockTypes, useFormContext } from '../../hooks';
const WelcomeScreensWrapper = () => {
	const { formId } = useFormContext();
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

	useEffect( () => {
		// fire event on unmount.
		return () => {
			doAction( 'QuillForms.RendererCore.WelcomeScreenPassed', {
				formId,
			} );
		};
	}, [] );

	const { goNext } = useDispatch( 'quillForms/renderer-core' );
	return (
		<>
			{ welcomeScreens?.length > 0 &&
				welcomeScreens.map( ( screen ) => {
					const blockType = blockTypes[ 'welcome-screen' ];
					return (
						//@ts-expect-error
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

export default WelcomeScreensWrapper;
