import { Fragment } from '@wordpress/element';
import { __experimentalUseFieldRenderContext } from '../field-render';
const BlockAttachment: React.FC = () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	if ( ! attributes ) return null;
	const { attachment } = attributes;
	return (
		<Fragment>
			{ attachment && Object.keys( attachment ).length > 0 ? (
				<div className="renderer-core-block-attachment">
					{ attachment && attachment.url ? (
						<img
							alt={ '' }
							src={ attachment.url }
							className="renderer-core-block-attachment__image"
						/>
					) : (
						<div className="renderer-core-block-attachment__placeholder">
							<svg
								className="renderer-core-block-attachment__placeholder-icon"
								focusable="false"
								viewBox="0 0 24 24"
								role="presentation"
							>
								<circle cx="12" cy="12" r="3.2" />
								<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
							</svg>
						</div>
					) }
				</div>
			) : null }
		</Fragment>
	);
};
export default BlockAttachment;
