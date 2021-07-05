/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';
import React from 'react';

const { Fill, Slot } = createSlotFill( 'formAdminBar' );

const FormAdminNavSlot = ( props ) => {
	return <Slot { ...props } />;
};

const FormAdminNavFill: React.FC = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const FormAdminNav: React.FC & {
	Slot?: typeof FormAdminNavSlot;
} = FormAdminNavFill;
FormAdminNav.Slot = FormAdminNavSlot;

export default FormAdminNav;
