import classnames from 'classnames';
import { css } from 'emotion';

const Attachment = ({ attributes, isPreview }) => {
	if (!attributes.attachment || Object.keys(attributes.attachment).length === 0) {
		// Show placeholder in preview mode
		if (isPreview) {
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
							`}
							overflow: hidden;
						`
					)}
				>
					<div className="renderer-core-block-attachment__placeholder">
						<svg
							className="renderer-core-block-attachment__placeholder-icon"
							focusable="false"
							viewBox="0 0 24 24"
							role="presentation"
						>
							<circle cx="12" cy="12" r="3.2" />
							<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5 5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
						</svg>
					</div>
				</div>
			);
		}
		return null;
	}

	const { attachment, layout } = attributes;
	const isVideo = attachment.type === 'video';
	const isSplit = layout === 'split-left' || layout === 'split-right';

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
						${!isSplit && `
							max-width: ${attributes?.attachmentMaxWidth || '100%'};
							margin: auto;
							text-align: center;
						`}
						${isSplit && `
							height: 100%;
							width: 100%;
							position: relative;
						`}
						overflow: hidden;
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
							background: transparent;
							pointer-events: auto;
						`} />
					)}
				</div>
			</div>
		);
	}

	// Image handling (existing functionality)
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
					`}
					overflow: hidden;
				`
			)}
		>
			{attachment && attachment.url ? (
				<img
					alt={attachment.alt || ''}
					src={attachment.url}
					className={classnames(
						'renderer-core-block-attachment__image',
						css`
							${attributes.layout !== 'split-right' &&
							attributes.layout !== 'split-left' &&
							`border-radius: ${attributes.attachmentBorderRadius};
							 margin: auto;
							`}
							${isSplit && `
								height: 100%;
								width: 100%;
								object-fit: cover;
							`}
						`
					)}
				/>
			) : (
				<>
					{isPreview && (
						<div className="renderer-core-block-attachment__placeholder">
							<svg
								className="renderer-core-block-attachment__placeholder-icon"
								focusable="false"
								viewBox="0 0 24 24"
								role="presentation"
							>
								<circle cx="12" cy="12" r="3.2" />
								<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5 5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
							</svg>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Attachment;
