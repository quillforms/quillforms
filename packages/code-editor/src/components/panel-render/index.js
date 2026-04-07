/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Button } from '@quillforms/admin-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/ext-language_tools';

const PanelRender = () => {
	const { customCSS } = useSelect((select) => {
		return {
			customCSS: select('quillForms/code-editor').getCustomCSS(),
		};
	});

	const { setCustomCSS } = useDispatch('quillForms/code-editor');
	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');
	return (
		<div
			id="code-editor-panel-render"
			className={css`
				height: 100%;
				display: flex;
				flex-direction: column;
				gap: 14px;
			` }
		>
			<div className={css`
				padding: 14px 16px;
				background: #daebfb;
				color: #334155;
				font-size: 14px;
				line-height: 1.5;
				font-weight: 500;
				border-radius: 12px;
				`}>
				{__("Custom css won't be applied to the form builder directly. Please click on the preview icon on the top right corner to see the changes.", 'quillforms')}
			</div>
			<div className={css`
				flex: 1;
				min-height: 280px;
				width: 100%;
				border-radius: 16px;
				overflow: hidden;
				border: 1px solid #0f172a;
				.ace_editor {
					width: 100% !important;
					height: 100% !important;
				}
				> div {
					width: 100%;
					height: 100%;
				}
			`}>
				<AceEditor
					mode="css"
					theme="solarized_dark"
					width="100%"
					height="100%"
					value={customCSS}
					onChange={setCustomCSS}
					name="QUILLFORMS_CSS_EDITOR"
					showPrintMargin={true}
					showGutter={true}
					highlightActiveLine={true}
					editorProps={{ $blockScrolling: true }}
					setOptions={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						enableSnippets: true,
						showLineNumbers: true,
						tabSize: 2,
					}}
				/>
			</div>
			<div className={css`
				position: sticky;
				bottom: 0;
				display: flex;
				justify-content: flex-end;
				gap: 24px;
               z-index: 5;
	            padding: 16px 0 16px;
				background: #fff;
			`}>
				<Button
					isDefault
					className={css`
						border: 1px solid #b2328c !important;
						color: #b2328c !important;
						background: #fff !important;
						border-radius: 16px !important;
						padding: 12px 24px !important;
						font-size: 18px !important;
						font-weight: 500 !important;
						height: 48px !important;
						min-height: 32px !important;
						line-height: 28px !important;
					`}
					onClick={() => setCurrentPanel('')}
				>
					{__('Cancel', 'quillforms')}
				</Button>
				<Button
					isPrimary
					className={css`
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
					`}
					onClick={() => setCurrentPanel('')}
				>
					{__('Save', 'quillforms')}
				</Button>
			</div>
		</div>
	);
};
export default PanelRender;
