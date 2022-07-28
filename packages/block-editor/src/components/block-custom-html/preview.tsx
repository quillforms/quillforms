/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { SandBox } from '@wordpress/components';

// Default styles used to unset some of the styles
// that might be inherited from the editor style.
const DEFAULT_STYLES = `
	 html,body,:root {
		 margin: 0 !important;
		 padding: 0 !important;
		 overflow: visible !important;
		 min-height: auto !important;
	 }
 `;

export default function HTMLEditPreview( { content, isSelected } ) {
	const styles = useMemo( () => [ DEFAULT_STYLES ], [] );

	return (
		<>
			<SandBox html={ content } styles={ styles } />
			{ /*
				 An overlay is added when the block is not selected in order to register click events.
				 Some browsers do not bubble up the clicks from the sandboxed iframe, which makes it
				 difficult to reselect the block.
			 */ }
			{ ! isSelected && (
				<div className="block-editor-block-custom-html__preview-overlay"></div>
			) }
		</>
	);
}
