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
import { Transforms, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

/**
 * QuillForms Dependencies
 */

import {
	__unstableCreateEditor as createEditor,
	__unstableHtmlSerialize as serialize,
	__unstableHtmlDeserialize as deserialize,
	__experimentalEditor as RichTextEditor,
} from '@quillforms/rich-text';
// @ts-expect-error
import type { allowedFormats, MergeTags } from '@quillforms/rich-text';

interface Props {
	value: string;
	editor: ReactEditor & HistoryEditor;
	setValue: ( value: string ) => void;
	mergeTags?: MergeTags;
	className?: string;
	allowedFormats?: allowedFormats;
	focusOnMount?: boolean;
}
const RichTextControl: React.FC< Props > = ( {
	value,
	setValue,
	mergeTags,
	className,
	allowedFormats,
	focusOnMount = false,
} ) => {
	const editor = useMemo( () => createEditor(), [] );

	const [ jsonVal, setJsonVal ] = useState< Node[] >( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	// Temp fix for changing value. There is an issue happens in notification message regarding changing the values of one rich text
	// And this is supposed to solve the problem.
	useEffect( () => {
		setJsonVal( deserialize( autop( value ) ) );
	}, [ value ] );

	const [ currentSelection, setCurrentSelection ] = useState( {
		path: [ 0, 0 ],
		offset: 0,
	} );

	// serializeVal is a debounced function that updates the store with serialized html value
	const serializeVal = useCallback(
		debounce( ( newVal ) => {
			setValue( serialize( newVal ) );
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
			/>
		),
		[ JSON.stringify( jsonVal ), JSON.stringify( mergeTags ) ]
	);

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

export default RichTextControl;
