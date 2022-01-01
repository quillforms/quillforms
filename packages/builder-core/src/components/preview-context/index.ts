/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

import type { PreviewContextContent } from './types';

const PreviewContext = createContext< PreviewContextContent >( {
	applyJumpLogic: false,
	setApplyJumpLogic: noop,
} );

const { Provider } = PreviewContext;

export { Provider as PreviewContextProvider };

const usePreviewContext = () => useContext( PreviewContext );

export { PreviewContext, usePreviewContext };
