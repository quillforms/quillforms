import {
	setBlockEditorConfig,
	setBlockRendererConfig,
} from '@quillforms/blocks';
import '@wordpress/element';
import * as website from './website';
import * as statement from './statement';
import * as shortText from './short-text';
import * as number from './number';
import * as multipleChoice from './multiple-choice';
import * as longText from './long-text';
import * as email from './email';
import * as dropdown from './dropdown';
import * as date from './date';

export const setBlocksRendererSettings = () => {
	[
		website,
		statement,
		shortText,
		longText,
		dropdown,
		email,
		multipleChoice,
		number,
		date,
	].forEach( ( block ) => {
		setBlockRendererConfig( block.type, {
			...block.settings.rendererConfig,
		} );
	} );
};

export const setBlocksEditorSettings = () => {
	[
		website,
		statement,
		shortText,
		longText,
		dropdown,
		email,
		multipleChoice,
		number,
		date,
	].forEach( ( block ) => {
		setBlockEditorConfig( block.type, {
			...block.settings.editorConfig,
		} );
	} );
};
