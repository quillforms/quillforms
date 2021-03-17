/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';
import React from 'react';

const { Fill, Slot } = createSlotFill( 'previewArea' );

const PreviewAreaSlot = ( props ) => {
	return <Slot { ...props } />;
};

const PreviewAreaFill: React.FC = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const PreviewArea: React.FC & {
	Slot?: typeof PreviewAreaSlot;
} = PreviewAreaFill;
PreviewArea.Slot = PreviewAreaSlot;

export default PreviewArea;
