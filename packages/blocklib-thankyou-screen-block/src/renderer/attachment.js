import classnames from 'classnames';
import { css } from 'emotion';
const Attachment = ({ attributes, isPreview }) => {
	return (
		<div
			className={classnames(
				'renderer-core-block-attachment',
				css`
					${attributes.layout !== 'split-right' &&
					attributes.layout !== 'split-left' &&
					`
					max-width: ${attributes?.attachmentMaxWidth};
					margin: auto;
					text-align: center;
					` }
					overflow: hidden;
				`
			)}
		>
			{attributes.attachment && attributes.attachment.url && (
				<img
					alt={''}
					src={attributes.attachment.url}
					className={classnames(
						'renderer-core-block-attachment__image',
						css`
							${attributes.layout !== 'split-right' &&
							attributes.layout !== 'split-left' &&
							`border-radius: ${attributes.attachmentBorderRadius};
							 margin: auto;
							` }
						`
					)}
				/>
			)
			}
		</div>
	);
};

export default Attachment;
