import {
	setBlockEditorConfig,
	setBlockRendererConfig,
} from '@quillforms/blocks';
import '@wordpress/element';

import * as welcomeScreen from './welcome-screen';
import * as website from './website';
import * as thankyouScreen from './thankyou-screen';
import * as statement from './statement';
import * as shortText from './short-text';
import * as rating from './rating';
import * as pictureChoice from './picture-choice';
import * as phone from './phone';
import * as opinionScale from './opinion-scale';
import * as number from './number';
import * as multipleChoice from './multiple-choice';
import * as longText from './long-text';
import * as legal from './legal';
import * as file from './file';
import * as email from './email';
import * as dropdown from './dropdown';
import * as date from './date';

export const setBlocksRendererSettings = () => {
	[
		welcomeScreen,
		website,
		thankyouScreen,
		statement,
		shortText,
		rating,
		pictureChoice,
		phone,
		longText,
		dropdown,
		email,
		file,
		multipleChoice,
		number,
		opinionScale,
		date,
		legal,
	].forEach( ( block ) => {
		setBlockRendererConfig( block.type, {
			...block.settings.rendererConfig,
		} );
	} );
};

export const setBlocksEditorSettings = () => {
	[
		welcomeScreen,
		website,
		thankyouScreen,
		statement,
		shortText,
		rating,
		pictureChoice,
		phone,
		longText,
		dropdown,
		email,
		file,
		multipleChoice,
		number,
		opinionScale,
		date,
		legal,
	].forEach( ( block ) => {
		setBlockEditorConfig( block.type, {
			...block.settings.editorConfig,
		} );
	} );
};
