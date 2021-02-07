/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';
import {
	__experimentalEditor as TextEditor,
	__unstableHtmlSerialize as serialize,
	__unstableFocus,
	getPlainText,
} from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';
import { useState, useCallback, useMemo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import BlockToolbar from '../block-toolbar';
import BlockAttachment from '../block-attachment';

const BlockEditor = ( props ) => {
	const { setBlockDesc, setBlockTitle } = useDispatch(
		'quillForms/block-editor'
	);

	const {
		attachment,
		id,
		blockColor,
		title,
		desc,
		addDesc,
		setTitleJsonVal,
		setDescJsonVal,
		titleEditor,
		descEditor,
		focusOn,
		setFocusOn,
		isSelected,
	} = props;

	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	const { prevFields } = useSelect( ( select ) => {
		return {
			prevFields: select( 'quillForms/block-editor' )
				.getPreviousEditableFields( id )
				.map( ( field ) => {
					return {
						type: 'field',
						label: field.title,
						modifier: field.id,
						icon: blockTypes[ field.type ]?.editorConfig?.icon,
						color: blockTypes[ field.type ]?.editorConfig?.color,
						order: select(
							'quillForms/block-editor'
						).getBlockOrderById( field.id ),
					};
				} ),
		};
	} );

	// State for popup showed after Accessing variables {{xx:yyy}} explicitly from editor!
	const [ varAlertPopup, setVarAlertPopup ] = useState( false );

	let currentEditor = titleEditor;
	if ( focusOn === 'desc' ) {
		currentEditor = descEditor;
	}
	// Serialize title is a debounced function that updates the store with serialized html value
	const serializeTitle = useCallback(
		debounce( ( value ) => {
			setBlockTitle( id, serialize( value ) );
		}, 400 ),
		[]
	);

	// Serialize description is a debounced function that updates the store with serialized html value
	const serializeDesc = useCallback(
		debounce( ( value ) => {
			setBlockDesc( id, serialize( value ) );
		}, 400 ),
		[]
	);

	// Calling use Effect on mount to set the focus
	// Because we use Intersection observer to determine the component should render on the scren or not,
	// we keep the focusOn as an internal state so when the component mounts again, the focus can still work.
	useEffect( () => {
		if ( isSelected ) {
			if ( focusOn === 'title' || ! focusOn ) {
				__unstableFocus( titleEditor );
			} else if ( focusOn === 'desc' ) {
				__unstableFocus( descEditor );
			}
		}
	}, [ isSelected ] );

	// Regex for variables
	const varRegexMatch = ( val ) =>
		new RegExp( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/ ).test( val );

	// Title Change Handler
	const titleChangeHandler = ( value ) => {
		if ( JSON.stringify( value ) !== JSON.stringify( title ) ) {
			setTitleJsonVal( value );
			if ( varRegexMatch( getPlainText( value ) ) ) {
				setVarAlertPopup( true );
			} else {
				serializeTitle( value );
			}
		}
	};

	// Description Change Handler
	const descChangeHandler = ( value ) => {
		if ( JSON.stringify( value ) !== JSON.stringify( desc ) ) {
			setDescJsonVal( value );
			if ( varRegexMatch( getPlainText( value ) ) ) {
				setVarAlertPopup( true );
			} else {
				serializeDesc( value );
			}
		}
	};

	// Title Rich Text Editor
	const TitleEditor = useMemo(
		() => (
			<div className="block-editor-block-edit__title-editor">
				<TextEditor
					editor={ titleEditor }
					placeholder="Type question here..."
					color="#262627"
					mergeTags={ prevFields }
					value={ title }
					onChange={ ( value ) => titleChangeHandler( value ) }
					onFocus={ () => {
						setFocusOn( 'title' );
					} }
				/>
			</div>
		),
		[ JSON.stringify( title ), JSON.stringify( prevFields ) ]
	);

	// Description Rich Text Editor
	const DescEditor = useMemo(
		() => (
			<div className="block-editor-block-edit__desc-editor">
				<TextEditor
					editor={ descEditor }
					placeholder="Write your description here"
					color="#898989"
					value={ desc }
					mergeTags={ prevFields }
					onChange={ ( value ) => descChangeHandler( value ) }
					onFocus={ () => {
						setFocusOn( 'desc' );
					} }
				/>
			</div>
		),
		[ JSON.stringify( desc ), JSON.stringify( prevFields ) ]
	);

	return (
		<div className="block-editor-block-edit">
			<div className="block-editor-block-edit__text-editor">
				{ TitleEditor }
				{ addDesc && DescEditor }
			</div>
			{ attachment && attachment.type === 'image' && (
				<BlockAttachment
					id={ id }
					blockColor={ blockColor }
					attachment={ attachment }
				/>
			) }

			<BlockToolbar id={ id } editor={ currentEditor } />
			{ varAlertPopup && (
				<Modal
					className={ classnames(
						'block-editor-block-edit__var-alert',
						css`
							border: none !important;
						`
					) }
					title="Warning!"
					onRequestClose={ () => {
						setVarAlertPopup( false );
						currentEditor.undo();
					} }
				>
					<div className="block-editor-block-edit__var-alert-body">
						You should not call variables directly from the editor.
					</div>
					<div className="block-editor-block-edit__var-alert-actions">
						<Button
							isDanger
							isLarge
							onClick={ () => {
								setVarAlertPopup( false );
								currentEditor.undo();
							} }
						>
							Ok
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
};

export default BlockEditor;
