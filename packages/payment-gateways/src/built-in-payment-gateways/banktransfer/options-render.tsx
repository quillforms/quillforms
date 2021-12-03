/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';

interface Props {
	slug: string;
	options: any;
	onOptionsChange: ( options ) => void;
}

const OptionsRender: React.FC< Props > = ( {
	slug,
	options,
	onOptionsChange,
} ) => {
	return <div></div>;
};

export default OptionsRender;
