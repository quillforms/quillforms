/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * React
 */
import { useEffect, useState } from 'react';

/**
 * QuillForms Dependencies
 */
import configApi from '@quillforms/config';

/**
 * External Dependencies
 */
import { Bars as Loader } from 'react-loader-spinner';
import { css } from 'emotion';
import ShareBody from './body';
import './style.scss';

const Share = ({ params }) => {
	const initialPayload = configApi.getInitialPayload();
	return (

		<ShareBody payload={initialPayload} />

	);
};

export default Share;
