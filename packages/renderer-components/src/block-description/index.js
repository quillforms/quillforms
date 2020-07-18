/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';

const BlockDesc = ( props ) => {
	const { description } = props;
	return (
		<Fragment>
			{ description && description !== '' && (
				<div className="renderer-components-block-description">
					<HtmlParser
						className="renderer-components-block-description__content"
						value={ description }
					/>
				</div>
			) }
		</Fragment>
	);
};
export default BlockDesc;
