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
	const { customCSS } = useSelect( ( select ) => {
		return {
			customCSS: select( 'quillForms/code-editor' ).getCustomCSS(),
		};
	} );

	const { setCustomCSS } = useDispatch( 'quillForms/code-editor' );
	return (
		<div
			id="code-editor-panel-render"
			className={ css`
				height: 100%;
				> div {
					width: 100% !important;
					height: 100% !important;
				}
			` }
		>
			<AceEditor
				mode="css"
				theme="solarized_dark"
				value={ customCSS }
				onChange={ setCustomCSS }
				name="QUILLFORMS_CSS_EDITOR"
				showPrintMargin={ true }
				showGutter={ true }
				highlightActiveLine={ true }
				editorProps={ { $blockScrolling: true } }
				setOptions={ {
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					showLineNumbers: true,
					tabSize: 2,
				} }
			/>
			,
		</div>
	);
};
export default PanelRender;
