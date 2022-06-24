import { Component } from '@wordpress/element';
import React, { FC } from 'react';
import {
	SET_BLOCK_ADMIN_SETTINGS,
	SET_BLOCK_RENDERER_SETTINGS,
	ADD_BLOCK_TYPES,
} from './store/constants';
import type { BlockAttributes, IconRenderer } from '@quillforms/types';

interface ControlsProps {
	id: string;
	attributes: BlockAttributes | undefined;
	setAttributes( T: Record< string, unknown > ): void;
}

interface EntryDetailsProps {
	id: string;
	attributes: BlockAttributes | undefined;
	value: any;
}
export interface BlockAdminSettings {
	title?: string;
	color?: string;
	icon?: IconRenderer;
	controls?: React.ComponentType< ControlsProps >;
	logicControl?: FC | Component | JSX.Element;
	order?: number;
	getChoices?: ( args: {
		id: string;
		attributes: BlockAttributes;
	} ) => { label: string; value: string }[];
	entryDetails?: React.ComponentType< EntryDetailsProps >;
}

export interface BlockRendererSettings {
	display?: FC | Component | JSX.Element;
	mergeTag?: FC | Component | JSX.Element;
	counterIcon?: FC | Component | JSX.Element;
	nextBtn?: FC | Component | JSX.Element;
	getNumericVal?: ( val: any, attributes: BlockAttributes ) => number;
	isConditionFulfilled?(
		conditionOperator: string,
		conditionVal: unknown,
		fieldValue: unknown
	): boolean;
}
export type BlockSupportedFeatures = {
	attachment?: boolean;
	description?: boolean;
	editable?: boolean;
	required?: boolean;
	logic?: boolean;
	logicConditions?: boolean;
	theme?: boolean;
	numeric?: boolean;
	choices?: boolean;
	payments?: boolean;
	points?: boolean;
};

type logicalOperator =
	| 'is'
	| 'is_not'
	| 'starts_with'
	| 'greater_than'
	| 'lower_than'
	| 'ends_with'
	| 'contains'
	| 'not_contains';
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
	supports: BlockSupportedFeatures;
	logicalOperators?: logicalOperator[];
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
	blockTypes: BlockTypeInterface[];
}
export type BlockActionTypes =
	| setBlockRendererSettingsAction
	| setBlockAdminSettingsAction
	| addBlockTypesAction
	| ReturnType< () => { type: 'NOOP' } >;
