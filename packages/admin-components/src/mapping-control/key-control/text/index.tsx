/**
 * QuillForms Dependencies
 */
import TextControl from '../../../text-control';

/**
 * WordPress Dependencies
 */
import { Disabled } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useMappingKeyControlContext } from '../context';

interface Props {}

const Text: React.FC< Props > = ( {} ) => {
	const { value, onChange, disabled } = useMappingKeyControlContext();

	const component = (
		<div className="mapping-key-control-text">
			<TextControl value={ value } onChange={ onChange } />
		</div>
	);

	return disabled ? <Disabled>{ component }</Disabled> : component;
};

export default Text;
