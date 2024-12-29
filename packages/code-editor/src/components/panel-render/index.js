/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

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
	return (
		<div
			id="code-editor-panel-render"
			className={css`
				height: 100%;
			` }
		>
			<div className={css`
				padding: 10px;
				background: antiquewhite;
				margin-bottom: 10px;
				height: 50px;
				border-radius: 5px;
				`}>
				Custom css won't be applied to the form builder directly. Please click on the preview icon on the top right corner to see the changes.
			</div>
			<div className={css`
				height: calc(100% - 60px);
				width: 100%;
				> div {
					width: 100%;
					height: 100%;
				}
			`}>
				<AceEditor
					mode="css"
					theme="solarized_dark"
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
			,
		</div>
	);
};
export default PanelRender;
