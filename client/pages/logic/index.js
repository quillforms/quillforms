/**
 * QuillForms Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import Builder from '../builder';

const LogicPage = ({ params }) => {
	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

	useEffect(() => {
		// Open the Jump Logic panel when visiting the Logic page.
		setCurrentPanel('jump-logic');

		return () => {
			// Reset panel when leaving the page to avoid leaking state.
			setCurrentPanel('');
		};
	}, []);

	return <Builder params={params} isLogicRoute />;
};

export default LogicPage;

