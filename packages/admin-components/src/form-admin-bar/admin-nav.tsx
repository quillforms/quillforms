/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';
import React from 'react';

const { Fill, Slot } = createSlotFill( 'formAdminBar' );

const FormAdminNavSlot = ( props ) => {
	return <Slot { ...props } />;
};

interface Props {
	children?: React.ReactNode; // 👈️ added type for children
}
const FormAdminNavFill: React.FC< Props > = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const FormAdminNav: React.FC & {
	Slot?: typeof FormAdminNavSlot;
} = FormAdminNavFill;
FormAdminNav.Slot = FormAdminNavSlot;

export default FormAdminNav;
