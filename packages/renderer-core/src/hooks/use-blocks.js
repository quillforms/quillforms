/**
 * QuillForms Dependencies
 */
import { concat } from '@quillforms/utils';

/**
 * Internal Dependencies
 */
import useFormContext from './use-form-context';

const useBlocks = () => {
	const {
		formObj: { blocks },
	} = useFormContext();
	let $blocks = blocks ? blocks : [];
	$blocks = concat( $blocks, {
		id: 'default_thankyou_screen',
		type: 'thankyou-screen',
	} );
	return $blocks;
};

export default useBlocks;
