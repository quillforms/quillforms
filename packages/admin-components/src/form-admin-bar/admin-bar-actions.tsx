/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';
import React from 'react';

const { Fill, Slot } = createSlotFill( 'formAdminBarActions' );

const FormAdminBarActionsSlot = ( props ) => {
	return <Slot { ...props } />;
};

interface Props {
	children?: React.ReactNode;
}
const FormAdminBarActionsFill: React.FC< Props > = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const FormAdminBarActions: React.FC & {
	Slot?: typeof FormAdminBarActionsSlot;
} = FormAdminBarActionsFill;
FormAdminBarActions.Slot = FormAdminBarActionsSlot;

export default FormAdminBarActions;
