/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';
import type { FormMessages } from '@quillforms/types';

/**
 * External Dependencies
 */
import { reduce } from 'lodash';

const getDefaultMessages = (): FormMessages => {
	const messagesStructure = ConfigAPI.getMessagesStructure();
	const res = reduce(
		messagesStructure,
		( accumulator, schema, key ) => {
			if ( schema.hasOwnProperty( 'default' ) ) {
				accumulator[ key ] = schema.default;
			}

			return accumulator;
		},
		{}
	);
	return res;
};

export default getDefaultMessages;
