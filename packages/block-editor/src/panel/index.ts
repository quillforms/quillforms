import { registerBuilderPanel } from '@quillforms/builder-panels';
import BlockControls from '../components/block-controls';

registerBuilderPanel( 'blockControls', {
	title: 'Block Controls',
	isHidden: true,
	mode: 'single',
	areaToShow: undefined,
	render: BlockControls,
} );
