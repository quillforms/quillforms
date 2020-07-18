/**
 * QuillForms Dependencies
 */
import {
	__unstableRichText as TextEditor,
	__unstableHtmlSerialize as serialize,
	__unstableEditor as Editor,
	__unstableFocus,
	getPlainText,
} from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import {
	memo,
	useState,
	useCallback,
	useMemo,
	useEffect,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import debounce from 'lodash/debounce';

/**
 * Internal Dependencies
 */
import BlockToolbar from '../block-toolbar';
import BlockAttachment from '../block-attachment';

// Checking some prevProps and nextProps for React memo
const areEqual = ( prevProps, nextProps ) => {
	if (
		prevProps.title === nextProps.title &&
		prevProps.desc === nextProps.desc &&
		prevProps.attachment === nextProps.attachment &&
		prevProps.focusOn === nextProps.focusOn &&
		prevProps.addDesc === nextProps.addDesc &&
		prevProps.index === nextProps.index
	)
		return true;
	return false;
};

const BlockEditor = memo( ( props ) => {
	const { setBlockDesc, setBlockTitle } = useDispatch(
		'quillForms/builder-core'
	);

	const [ currentPath, setCurrentPath ] = useState( {
		path: [ 0, 0 ],
		offset: 0,
	} );

	const {
		attachment,
		id,
		index,
		blockColor,
		category,
		title,
		desc,
		addDesc,
		setTitleJsonVal,
		setDescJsonVal,
		titleEditor,
		descEditor,
		focusOn,
		setFocusOn,
		insertVariable,
		insertEmoji,
	} = props;

	const { isSelected } = useSelect( ( select ) => {
		return {
			isSelected:
				select( 'quillForms/builder-core' ).getCurrentBlockId() === id,
		};
	} );

	const { fields } = useSelect( ( select ) => {
		return {
			fields: select( 'quillForms/builder-core' ).getFields(),
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
			setBlockTitle( id, serialize( value ), category );
		}, 400 ),
		[]
	);

	// Serialize description is a debounced function that updates the store with serialized html value
	const serializeDesc = useCallback(
		debounce( ( value ) => {
			setBlockDesc( id, serialize( value ), category );
		}, 400 ),
		[]
	);

	// Calling use Effect on mount to set the focus
	// Because we use Intersection observer to determine the component should render on the scren or not,
	// we keep the focusOn as an internal state so when the component mounts again, the focus can still work.
	useEffect( () => {
		if ( isSelected ) {
			if ( focusOn === 'title' ) {
				__unstableFocus( titleEditor );
			} else if ( focusOn === 'desc' ) {
				__unstableFocus( descEditor );
			}
		}
	}, [ isSelected ] );

	// Check for incorrrect field vars and fix them on index change
	useEffect( () => {
		const currentFieldIndex = index;
		[ titleEditor, descEditor ].forEach( ( editor ) => {
			const fieldIds = [];
			{
				const [ ...match ] = Editor.nodes( editor, {
					match: ( n ) =>
						n.type === 'variable' && n.data.varType === 'field',
					at: [],
				} );
				if ( match.length > 0 ) {
					match.forEach( ( m ) => {
						const fieldId = m[ 0 ].data.ref;
						const fieldIndex = fields.findIndex(
							( field ) => field.id === fieldId
						);
						if ( fieldIndex >= currentFieldIndex ) {
							fieldIds.push( fieldId );
						}
					} );
				}
			}

			if ( fieldIds.length > 0 ) {
				fieldIds.forEach( ( fieldId ) => {
					const [ ...match ] = Editor.nodes( editor, {
						match: ( n ) => {
							return (
								n.type === 'variable' &&
								n.data &&
								n.data.varType === 'field' &&
								n.data.ref === fieldId
							);
						},
						at: [],
					} );
					const path = match[ 0 ][ 1 ];
					const [ node ] = Editor.node( editor, path );
					editor.apply( { type: 'remove_node', path, node } );
				} );
			}
		} );
	}, [ index ] );

	// Regex for variables
	const varRegexMatch = ( val ) =>
		new RegExp( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/ ).test( val );

	// Title Change Handler
	const titleChangeHandler = ( value ) => {
		if ( titleEditor.selection ) {
			setCurrentPath( {
				path: titleEditor.selection.focus.path,
				offset: titleEditor.selection.focus.offset,
			} );
		}
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
		if ( descEditor.selection ) {
			setCurrentPath( {
				path: descEditor.selection.focus.path,
				offset: descEditor.selection.focus.offset,
			} );
		}
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
					onFocus={ () => {
						const { selection } = titleEditor;
						setFocusOn( 'title' );
						if ( selection ) {
							setCurrentPath( {
								path: selection.focus.path,
								offset: selection.focus.offset,
							} );
						}
					} }
					color="#262627"
					emojiSelect={ insertEmoji }
					value={ title }
					onChange={ ( value ) => titleChangeHandler( value ) }
				/>
			</div>
		),
		[ JSON.stringify( title ) ]
	);

	// Description Rich Text Editor
	const DescEditor = useMemo(
		() => (
			<div className="block-editor-block-edit__desc-editor">
				<TextEditor
					editor={ descEditor }
					placeholder="Write your description here"
					color="#898989"
					onFocus={ () => {
						const { selection } = descEditor;
						setFocusOn( 'desc' );
						if ( selection ) {
							setCurrentPath( {
								path: selection.focus.path,
								offset: selection.focus.offset,
							} );
						}
					} }
					value={ desc }
					onChange={ ( value ) => descChangeHandler( value ) }
				/>
			</div>
		),
		[ JSON.stringify( desc ) ]
	);

	return (
		<div className="block-editor-block-edit">
			<div className="block-editor-block-edit__text-editor">
				{ TitleEditor }
				{ addDesc && DescEditor }
			</div>
			{ attachment && attachment.type === 'image' && (
				<BlockAttachment
					category={ category }
					id={ id }
					blockColor={ blockColor }
					attachment={ attachment }
				/>
			) }

			<BlockToolbar
				id={ id }
				category={ category }
				insertEmoji={ ( emoji ) => insertEmoji( emoji, currentPath ) }
				insertVariable={ ( variable ) =>
					insertVariable( variable, currentPath )
				}
			/>

			<Dialog
				className="block-editor-block-edit__alert"
				open={ varAlertPopup }
				onClose={ () => {
					setVarAlertPopup( false );
					currentEditor.undo();
				} }
				aria-labelledby={ 'Warning' }
				aria-describedby={ 'Warning' }
			>
				<DialogTitle id={ `alert-dialog-title` }>
					{ 'Warning!' }
				</DialogTitle>
				<DialogContent className="dialog__content">
					<DialogContentText id={ 'varibleAlet_dialog__description' }>
						You should not call variables directly from the editor.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						className="dialog__danger__button"
						onClick={ () => {
							setVarAlertPopup( false );
							currentEditor.undo();
						} }
						color="primary"
					>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}, areEqual );

export default BlockEditor;
