import { Component } from '@wordpress/element';
import { FC } from 'react';
import {
	SET_BLOCK_ADMIN_SETTINGS,
	SET_BLOCK_RENDERER_SETTINGS,
	ADD_BLOCK_TYPES,
} from './store/constants';

export type BlockIcon = FC | Component | JSX.Element | string;
export type BlockIconDescriptor = {
	src: BlockIcon;
	background?: string;
	foreground?: string;
	shadowColor?: string;
};
export type BlockTypeIcon = BlockIconDescriptor | BlockIcon | undefined;
export interface BlockAdminSettings {
	title?: string;
	color?: string;
	icon?: BlockTypeIcon;
	controls?: FC | Component | JSX.Element;
	logicControl?: FC | Component | JSX.Element;
}

export interface BlockRendererSettings {
	output?: FC | Component | JSX.Element;
	mergeTag?: FC | Component | JSX.Element;
	counterContent?: FC | Component | JSX.Element;
	nextBtn?: FC | Component | JSX.Element;
}
export type BlockSupportedFeatures = {
	attachment?: boolean;
	description?: boolean;
	editable?: boolean;
	required?: boolean;
	logic?: boolean;
};

export interface BlockTypeSettings
	extends BlockAdminSettings,
		BlockRendererSettings {
	attributes?: Record<
		string,
		{
			type: string;
			default?: unknown;
			[ x: string ]: unknown;
		}
	>;
	supports?: BlockSupportedFeatures;
	logicalOperators?: (
		| 'is'
		| 'is_not'
		| 'starts_with'
		| 'greater_than'
		| 'lower_than'
		| 'ends_with'
		| 'contains'
		| 'not_contains'
	 )[];
}

export interface BlockTypeInterface extends BlockTypeSettings {
	name: string;
}

export interface BlocksState {
	[ name: string ]: BlockTypeSettings;
}

/**
 * Actions
 */

interface anyAction {
	type: string;
	[ x: string ]: unknown;
}
interface setBlockRendererSettingsAction extends anyAction {
	type: typeof SET_BLOCK_RENDERER_SETTINGS;
	settings: BlockRendererSettings;
	name: string;
}

interface setBlockAdminSettingsAction extends anyAction {
	type: typeof SET_BLOCK_ADMIN_SETTINGS;
	settings: BlockAdminSettings;
	name: string;
}

interface addBlockTypesAction extends anyAction {
	type: typeof ADD_BLOCK_TYPES;
	blockTypes?: BlockTypeInterface[];
}
export type BlockActionTypes =
	| setBlockRendererSettingsAction
	| setBlockAdminSettingsAction
	| addBlockTypesAction;
