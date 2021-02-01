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
import { plusCircle } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import classnames from 'classnames';
import { Transforms } from 'slate';

/**
 * Internal Dependencies
 */
import createEditor from '../../create-editor';
import deserialize from '../../html-deserialize';
import serialize from '../../html-serialize';
import moveFocusToEnd from '../../focus';
import RichTextEditor from '../editor';
import insertText from '../../insert-text';

const RichTextControl = ( {
	value,
	setValue,
	mergeTags,
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

	const [ currentSelection, setCurrentSelection ] = useState( {
		path: [ 0, 0 ],
		offset: 0,
	} );

	const editor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withMergeTags: true,
				withHistory: true,
				withLinks: true,
			} ),
		[]
	);

	// serializeVal is a debounced function that updates the store with serialized html value
	const serializeVal = useCallback(
		debounce( ( newVal ) => {
			setValue( serialize( newVal ) );
		}, 200 ),
		[]
	);

	const onChange = ( newVal ) => {
		if ( editor.selection ) {
			setCurrentSelection( {
				path: editor.selection.focus.path,
				offset: editor.selection.focus.offset,
			} );
		}
		setJsonVal( newVal );
		serializeVal( newVal );
	};

	// Deserialize value on mount.
	useEffect( () => {
		if ( forceFocusOnMount ) {
			setTimeout( () => {
				moveFocusToEnd( editor );
			}, 0 );
		}
		setJsonVal( deserialize( autop( value ) ) );
	}, [] );

	const TextEditor = useMemo(
		() => (
			<RichTextEditor
				value={ jsonVal }
				editor={ editor }
				onChange={ onChange }
				mergeTags={ mergeTags }
				onFocus={ () => {
					if ( editor.selection ) {
						setCurrentSelection( {
							path: editor.selection.focus.path,
							offset: editor.selection.focus.offset,
						} );
					}
				} }
			/>
		),
		[ JSON.stringify( jsonVal ), JSON.stringify( mergeTags ) ]
	);

	return (
		<div className={ classnames( 'rich-text-control', className ) }>
			<Fragment>
				{ TextEditor }
				{ mergeTags?.length > 0 && (
					<Fragment>
						<div className="rich-text-control__add-merge-tags">
							<Icon
								icon={ plusCircle }
								onClick={ ( e ) => {
									e.stopPropagation();

									insertText( editor, '@', {
										at: currentSelection,
									} );
									setTimeout( () => {
										Transforms.select(
											editor,
											currentSelection
										);
										moveFocusToEnd( editor );
										Transforms.move( editor, {
											unit: 'character',
										} );
									}, 0 );
								} }
							/>
						</div>
					</Fragment>
				) }
			</Fragment>
		</div>
	);
};

export default RichTextControl;
