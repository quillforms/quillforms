import '@wordpress/data';
import '@wordpress/compose';
import {
	setBlocksRendererSettings,
	setBlocksEditorSettings,
} from '@quillforms/block-library';
import '@quillforms/renderer-core';
import '@quillforms/builder-panels';
import './store';
export * from './components';
setBlocksRendererSettings();
setBlocksEditorSettings();
