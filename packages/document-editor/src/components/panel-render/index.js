/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import PostTitle from '../post-title';
import PostSlug from '../post-slug';

const rootStyle = css`
	flex: 1 1 auto;
	min-height: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

const contentStyle = css`
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	overflow-y: auto;
`;

const footerStyle = css`
	flex-shrink: 0;
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 24px;
	margin-top: auto;
	padding: 16px 0  24px;
	background: #fff;
`;

const cancelBtnStyle = css`
	border: 1px solid #b2328c !important;
	color: #b2328c !important;
	background: #fff !important;
	border-radius: 16px !important;
	padding: 12px 24px !important;
	font-size: 18px !important;
	font-weight: 500 !important;
	height: 48px !important;
	min-height: 48px !important;
	line-height: 28px !important;
`;

const saveBtnStyle = css`
	border: 1px solid #b2328c !important;
	color: #fff !important;
	background: #b2328c !important;
	border-radius: 16px !important;
	padding: 12px 24px !important;
	font-size: 18px !important;
	font-weight: 500 !important;
	height: 48px !important;
	min-height: 48px !important;
	line-height: 28px !important;
`;

const PanelRender = () => {
	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

	return (
		<div className={`document-editor-panel-render ${rootStyle}`}>
			<div className={contentStyle}>
				{/* <PostTitle /> */}
				<PostSlug />
			</div>
			<div className={footerStyle} role="group" aria-label={__('Form actions', 'quillforms')}>
				<Button
					isDefault
					className={cancelBtnStyle}
					onClick={() => setCurrentPanel('')}
				>
					{__('Cancel', 'quillforms')}
				</Button>
				<Button
					isPrimary
					className={saveBtnStyle}
					onClick={() => setCurrentPanel('')}
				>
					{__('Save', 'quillforms')}
				</Button>
			</div>
		</div>
	);
};
export default PanelRender;
