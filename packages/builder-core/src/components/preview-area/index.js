/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'previewArea' );

function PreviewAreaSlot( props ) {
	return <Slot { ...props } />;
}

const PreviewAreaFill = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const PreviewArea = PreviewAreaFill;
PreviewArea.Slot = PreviewAreaSlot;

export default PreviewArea;
