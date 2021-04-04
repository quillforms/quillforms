import useFormContext from './use-form-context';
import ConfigAPI from '@quillforms/config';
import { reduce } from 'lodash';

const useMessages = () => {
	const getDefaultMessages = () => {
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
	const {
		formObj: { messages },
	} = useFormContext();
	return {
		...getDefaultMessages(),
		...messages,
	};
};

export default useMessages;
