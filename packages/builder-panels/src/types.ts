import {
	SET_CURRENT_PANEL,
	SET_CURRENT_SUBPANEL,
	REGISTER_BUILDER_PANEL,
	REGISTER_BUILDER_SUBPANEL,
} from './store/constants';
import type { IconRenderer } from '@quillforms/types';
import { FC, Component } from 'react';

export type PanelSettings = {
	icon?: IconRenderer;
	title: string;
	render?: FC | JSX.Element | Component;
	mode: 'single' | 'parent';
	areaToShow?: 'preview-area' | 'drop-area' | undefined | 'no-area';
	isHidden?: boolean;
	position?: number;
};

export type SubPanelSettings = {
	title: string;
	position?: number;
	render: FC | JSX.Element | Component;
};

export interface Panel extends PanelSettings {
	name: string;
	subPanels?: SubPanel[];
}

export interface SubPanel extends SubPanelSettings {
	name: string;
}

export type PanelsState = {
	panels: Panel[];
	currentPanel?: string;
	currentSubPanel?: string;
	areaToShow: 'preview-area' | 'drop-area' | undefined;
};

/**
 * Actions
 */

interface anyAction {
	type: string;
	[ x: string ]: unknown;
}

interface setCurrentPanelAction extends anyAction {
	type: typeof SET_CURRENT_PANEL;
	panelName: string;
}

interface setCurrentSubPanelAction extends anyAction {
	type: typeof SET_CURRENT_SUBPANEL;
	subPanelName: string;
}

interface registerBuilderPanelAction extends anyAction {
	type: typeof REGISTER_BUILDER_PANEL;
	settings: PanelSettings;
	name: string;
}

interface registerBuilderSubPanelAction extends anyAction {
	type: typeof REGISTER_BUILDER_SUBPANEL;
	settings: SubPanelSettings;
	name: string;
	parent: string;
}

export type PanelActionTypes =
	| setCurrentPanelAction
	| setCurrentSubPanelAction
	| registerBuilderPanelAction
	| registerBuilderSubPanelAction
	| ReturnType< () => { type: 'NOOP' } >;
