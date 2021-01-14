/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { autop } from '@wordpress/autop';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { useFieldRenderContext } from '../field-render/context';

const BlockDesc = () => {
	const { description } = useFieldRenderContext();
	return (
		<Fragment>
			{ description && description !== '' && (
				<div className="renderer-components-block-description">
					<HtmlParser
						className="renderer-components-block-description__content"
						value={ autop( description ) }
					/>
				</div>
			) }
		</Fragment>
	);
};
export default BlockDesc;
