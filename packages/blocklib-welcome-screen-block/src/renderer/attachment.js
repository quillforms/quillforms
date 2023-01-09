import classnames from 'classnames';
import { css } from 'emotion';
const Attachment = ( { attributes, isPreview } ) => {
	return (
		<div
			className={ classnames(
				'renderer-core-block-attachment',
				css`
					${ attributes.layout !== 'split-right' &&
					attributes.layout !== 'split-left' &&
					`
					max-width: ${ attributes?.attachmentMaxWidth };
					margin: auto;
					text-align: center;
					` }
					overflow: hidden;
				`
			) }
		>
			{ attributes.attachment && attributes.attachment.url ? (
				<img
					alt={ '' }
					src={ attributes.attachment.url }
					className={ classnames(
						'renderer-core-block-attachment__image',
						css`
							${ attributes.layout !== 'split-right' &&
							attributes.layout !== 'split-left' &&
							`border-radius: ${ attributes.attachmentBorderRadius };
							 margin: auto;
							` }
						`
					) }
				/>
			) : (
				<>
					{ isPreview && (
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
				</>
			) }
		</div>
	);
};

export default Attachment;
