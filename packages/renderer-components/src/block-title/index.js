/**
 * WordPress Dependencies
 */
import { autop } from '@wordpress/autop';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { useFieldRenderContext } from '../field-render/context';

const BlockTitle = () => {
	const { field } = useFieldRenderContext();
	let title = field.title;
	if ( ! field.title ) {
		title = '...';
	}
	return (
		<div className="renderer-components-block-title">
			<HtmlParser
				className="renderer-components-block-title__content"
				value={ autop( title ) }
			/>
		</div>
	);
};
export default BlockTitle;
