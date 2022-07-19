/**
 * WordPress Dependencies
 */
import {
	useMemo,
	useCallback,
	useEffect,
	useState,
	useRef,
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
import { Transforms, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

/**
 * Internal Dependencies
 */
import createEditor from '../../create-editor';
import deserialize from '../../html-deserialize';
import serialize from '../../html-serialize';
import RichTextEditor from '../editor';
import { allowedFormats, CustomNode, MergeTags } from '../../types';

interface Props {
	value: string;
	id?: string;
	setValue: ( value: string ) => void;
	mergeTags?: MergeTags;
	className?: string;
	allowedFormats?: allowedFormats;
	focusOnMount?: boolean;
	placeholder?: string;
}
const RichTextControlRenderer: React.FC< Props > = ( {
	id,
	value,
	setValue,
	mergeTags,
	className,
	allowedFormats,
	focusOnMount = false,
	placeholder,
} ) => {
	const [ isReady, setIsReady ] = useState( false );
	const [ jsonVal, setJsonVal ] = useState< CustomNode[] >( [
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

	const editor: ReactEditor & HistoryEditor = useMemo( () => createEditor(), [
		id,
		isReady,
	] );

	const isMounted = useRef( false );
	useEffect( () => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, [] );

	// serializeVal is a debounced function that updates the store with serialized html value
	const serializeVal = useCallback(
		debounce( ( newVal ) => {
			if ( isMounted.current ) {
				setValue( serialize( newVal ) );
			}
		}, 200 ),
		[]
	);

	const onChange = ( newVal: Node[] ) => {
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
		if ( focusOnMount ) {
			setTimeout( () => {
				ReactEditor.focus( editor );
			}, 0 );
		}
	}, [] );

	useEffect( () => {
		setIsReady( false );
		setJsonVal( deserialize( autop( value ) ) );
		setIsReady( true );
	}, [ mergeTags?.length ] );

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
				allowedFormats={ allowedFormats }
				placeholder={ placeholder }
			/>
		),
		[ isReady, JSON.stringify( jsonVal ), JSON.stringify( mergeTags ) ]
	);

	if ( ! isReady ) return null;

	return (
		<div className={ classnames( 'rich-text-control', className ) }>
			<Fragment>
				{ TextEditor }
				{ mergeTags && mergeTags.length > 0 && (
					<Fragment>
						<div className="rich-text-control__add-merge-tags">
							<Icon
								icon={ plusCircle }
								onClick={ ( e: MouseEvent ) => {
									e.stopPropagation();

									Transforms.insertText( editor, '@', {
										at: currentSelection,
									} );
									setTimeout( () => {
										Transforms.select(
											editor,
											currentSelection
										);
										ReactEditor.focus( editor );
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
export default RichTextControlRenderer;
