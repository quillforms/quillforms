/**
 * QuillForms Dependencies
 */
import {
	__unstableCreateEditor as createEditor,
	__unstableInsertNodes as insertNodes,
	__unstableHtmlDeserialize as deserialize,
	__unstableHtmlSerialize as serialize,
	__unstableRichText as RichText,
	__unstableMoveFocusToEnd as moveFocusToEnd,
} from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import {
	useMemo,
	useCallback,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element';
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import RecallInformation from '../recall-information';

const RichTextControl = ( {
	value,
	setValue,
	variables,
	className,
	forceFocusOnMount = false,
} ) => {
	const [ jsonVal, setJsonVal ] = useState( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const [ currentPath, setCurrentPath ] = useState( {
		path: [ 0, 0 ],
		offset: 0,
	} );

	const [ anchorEl, setAnchorEl ] = useState( null );

	const handleClick = ( event ) => {
		setAnchorEl( event.currentTarget );
	};

	const handleClose = () => {
		setAnchorEl( null );
	};

	const editor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withVariables: true,
				withHistory: true,
				withLinks: true,
			} ),

		[]
	);

	// Insert Variable
	const insertVariable = ( variable, path ) => {
		insertNodes(
			editor,
			{
				type: 'variable',
				data: {
					ref: variable.ref,
					varType: variable.varType,
				},
				children: [ { text: '' } ],
			},
			{
				at: path,
			}
		);
	};

	// serializeVal is a debounced function that updates the store with serialized html value
	const serializeVal = useCallback(
		debounce( ( newVal ) => {
			setValue( serialize( newVal ) );
		}, 200 ),
		[]
	);

	const onChange = ( newVal ) => {
		if ( editor.selection ) {
			setCurrentPath( {
				path: editor.selection.focus.path,
				offset: editor.selection.focus.offset,
			} );
		}
		setJsonVal( newVal );
		serializeVal( newVal );
	};

	// Deserialize value on mount.
	useEffect( () => {
		//moveEditor( editor );
		if ( forceFocusOnMount ) {
			setTimeout( () => {
				moveFocusToEnd( editor );
			}, 0 );
		}
		setJsonVal( deserialize( autop( value ) ) );
	}, [] );

	const TextEditor = useMemo(
		() => (
			<RichText
				onFocus={ () => {
					if ( editor.selection ) {
						setCurrentPath( {
							path: editor.selection.focus.path,
							offset: editor.selection.focus.offset,
						} );
					}
				} }
				value={ jsonVal }
				editor={ editor }
				onChange={ onChange }
			/>
		),
		[ JSON.stringify( jsonVal ) ]
	);

	return (
		<div
			className={ classnames(
				'builder-components-rich-text-control',
				className
			) }
		>
			<Fragment>
				{ TextEditor }
				{ variables?.length > 0 && (
					<Fragment>
						<div
							className="builder-components-rich-text-control__add-variables"
							role="presentation"
							onClick={ handleClick }
						>
							<AddCircleIcon />
						</div>
						<RecallInformation
							insertVariable={ ( variable ) =>
								insertVariable( variable, currentPath )
							}
							variables={ variables }
							onClose={ handleClose }
							anchorEl={ anchorEl }
							setAnchorEl={ setAnchorEl }
						/>
					</Fragment>
				) }
			</Fragment>
		</div>
	);
};

export default RichTextControl;
