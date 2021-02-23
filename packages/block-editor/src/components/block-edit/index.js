/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
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
	const { setBlockAttributes } = useDispatch( 'quillForms/block-editor' );

	const {
		attributes,
		id,
		blockColor,
		label,
		desc,
		setLabelJsonVal,
		setDescJsonVal,
		labelEditor,
		descEditor,
		focusOn,
		setFocusOn,
		isSelected,
	} = props;
	const { attachment } = attributes;

	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	const { prevFields } = useSelect( ( select ) => {
		return {
			prevFields: select(
				'quillForms/block-editor'
			).getPreviousEditableFields( id ),
		};
	} );

	const mergeTags = prevFields.map( ( field ) => {
		return {
			type: 'field',
			label: field.attributes.label,
			modifier: field.id,
			icon: blockTypes[ field.name ]?.icon,
			color: blockTypes[ field.name ]?.color,
			order: field.order,
		};
	} );

	// State for popup showed after Accessing variables {{xx:yyy}} explicitly from editor!
	const [ varAlertPopup, setVarAlertPopup ] = useState( false );

	let currentEditor = labelEditor;
	if ( focusOn === 'desc' ) {
		currentEditor = descEditor;
	}
	// Serialize label is a debounced function that updates the store with serialized html value
	const serializeLabel = useCallback(
		debounce( ( value ) => {
			setBlockAttributes( id, { label: serialize( value ) } );
		}, 200 ),
		[]
	);

	// Serialize description is a debounced function that updates the store with serialized html value
	const serializeDesc = useCallback(
		debounce( ( value ) => {
			setBlockAttributes( id, { description: serialize( value ) } );
		}, 200 ),
		[]
	);

	// Calling use Effect on mount to set the focus
	// Because we use Intersection observer to determine the component should render on the scren or not,
	// we keep the focusOn as an internal state so when the component mounts again, the focus can still work.
	useEffect( () => {
		if ( isSelected ) {
			if ( focusOn === 'label' || ! focusOn ) {
				__unstableFocus( labelEditor );
			} else if ( focusOn === 'desc' ) {
				__unstableFocus( descEditor );
			}
		}
	}, [ isSelected ] );

	// Regex for variables
	const varRegexMatch = ( val ) =>
		new RegExp( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/ ).test( val );

	// Title Change Handler
	const labelChangeHandler = ( value ) => {
		if ( JSON.stringify( value ) !== JSON.stringify( label ) ) {
			setLabelJsonVal( value );
			if ( varRegexMatch( getPlainText( value ) ) ) {
				setVarAlertPopup( true );
			} else {
				serializeLabel( value );
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
	const LabelEditor = useMemo(
		() => (
			<div className="block-editor-block-edit__title-editor">
				<TextEditor
					editor={ labelEditor }
					placeholder="Type question here..."
					color="#262627"
					mergeTags={ mergeTags }
					value={ label }
					onChange={ ( value ) => labelChangeHandler( value ) }
					onFocus={ () => {
						setFocusOn( 'title' );
					} }
				/>
			</div>
		),
		[ JSON.stringify( label ), JSON.stringify( prevFields ) ]
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
					mergeTags={ mergeTags }
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
				{ LabelEditor }
				{ DescEditor }
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
