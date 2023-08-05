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
import ShareBody from './body';
import './style.css';

const Share = ({ params }) => {
	const initialPayload = configApi.getInitialPayload();
	return (

		<ShareBody payload={initialPayload} />

	);
};

export default Share;
