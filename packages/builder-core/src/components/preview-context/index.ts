/**
 * WordPress Dependencies
 */
import { createContext, useContext } from 'react';
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
