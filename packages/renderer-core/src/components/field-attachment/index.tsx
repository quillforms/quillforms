import { __experimentalUseFieldRenderContext } from '../field-render';
import classnames from 'classnames';
import { css } from 'emotion';
import { useMediaQuery } from "@uidotdev/usehooks";
const BlockAttachment: React.FC = () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	if (!attributes) return null;
	const { attachment, layout } = attributes;
	if (!attachment || Object.keys(attachment).length === 0) return null;

	const isVideo = attachment.type === 'video';
	const isSplit = isSmallDevice ? false : layout === 'split-left' || layout === 'split-right';
	const isFloat = isSmallDevice ? layout === 'float-left' || layout === 'float-right' : false;

	if (isVideo && attachment.url) {
		// Extract YouTube video ID
		const match = attachment.url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
		const videoId = match ? match[1] : null;
		if (!videoId) return null;

		// Parameters for both layouts
		const commonParams = 'rel=0&iv_load_policy=3&modestbranding=1';

		// For split layouts: autoplay, mute, no controls, no title
		// For other layouts: no autoplay, with controls
		const embedUrl = isSplit
			? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&${commonParams}`
			: `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&${commonParams}`;

		return (
			<div
				className={classnames(
					'renderer-core-block-attachment',
					css`
						${!isSplit && `max-width: ${attributes?.attachmentMaxWidth || '100%'};`}
						${isSplit && `
							height: 100%;
							width: 100%;
							position: relative;
							overflow: hidden;
						`}
						${isFloat && `
							display: flex;
							align-items: center;
							justify-content: center;
						`}
					`
				)}
			>
				{/* YouTube iframe */}
				<div className={css`
					position: relative;
					width: 100%;
					height: ${isSplit ? "100%" : "315px"};
					overflow: hidden;
				`}>
					<iframe
						width="100%"
						height="100%"
						src={embedUrl}
						frameBorder="0"
						allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className={css`
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							${!isSplit && `border-radius: ${attributes.attachmentBorderRadius || '0'};`}
						`}
					/>

					{/* Overlay for split layouts to prevent hover interactions */}
					{isSplit && (
						<div className={css`
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 1;
							/* This is transparent but blocks mouse events */
							background: transparent;
							pointer-events: auto;
						`} />
					)}
				</div>
			</div>
		);
	}

	// Image handling
	return (
		<div
			className={classnames(
				'renderer-core-block-attachment',
				css`
					${!isSplit && `max-width: ${attributes?.attachmentMaxWidth || '100%'};`}
					${isSplit && `
						height: 100%;
						width: 100%;
					`}
					${isFloat && `
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				`
			)}
		>
			{attachment && attachment.url && (
				<img
					alt={(attachment as any).alt || ''}
					src={attachment.url}
					className={classnames(
						'renderer-core-block-attachment__image',
						css`
							${!isSplit && `border-radius: ${attributes.attachmentBorderRadius || '0'}`}
							${isSplit && `
								height: 100%;
								width: 100%;
								object-fit: cover;
							`}
							${isFloat && `
								margin: 0 auto;
								max-width: 100%;
							`}
						`
					)}
				/>
			)}
		</div>
	);
};

export default BlockAttachment;