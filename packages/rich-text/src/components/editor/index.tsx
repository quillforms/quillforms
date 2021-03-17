/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import {
	Fragment,
	useCallback,
	useState,
	useEffect,
	useRef,
} from '@wordpress/element';

/**
 * External Dependencies
 */
import { Transforms, Text, Editor, Range, Node as SlateNode } from 'slate';
import { Slate, Editable, ReactEditor, RenderElementProps } from 'slate-react';
import { HistoryEditor } from 'slate-history';
/**
 * Internal Dependencies
 */
import Element from '../element';
import HoveringToolbar from '../hovering-toolbar';
import MergeTagListItem from '../merge-tag-list-item';
import Portal from '../portal';
import type { MergeTags, MergeTag, FormatControls } from '../../types';
interface Props {
	editor: ReactEditor & HistoryEditor;
	placeholder?: string;
	color?: string;
	value: SlateNode[];
	onChange: ( value: SlateNode[] ) => void;
	onFocus: React.FocusEventHandler;
	mergeTags?: MergeTags;
	formattingControls?: FormatControls;
}
const TextEditor: React.FC< Props > = ( props ) => {
	const {
		editor,
		placeholder,
		color,
		onChange,
		value,
		onFocus,
		mergeTags = [],
		formattingControls = [ 'bold', 'italic' ],
	} = props;

	const wrapperRef = useRef< HTMLDivElement >( null );

	const ref = useRef< HTMLDivElement >( null );
	const [ target, setTarget ] = useState< Range | undefined >();
	const [ index, setIndex ] = useState( 0 );
	const [ search, setSearch ] = useState( '' );

	const $mergeTags = mergeTags.filter( ( c ) => {
		if ( search ) {
			return c.label
				?.toLowerCase()
				.startsWith( search ? search.toLowerCase() : '' );
		}
		return true;
	} );

	const isFormatActive = ( format ) => {
		const [ match ] = Editor.nodes( editor, {
			match: ( n ) => n[ format ] === true,
			mode: 'all',
		} );
		return !! match;
	};

	const renderElement = ( $props: RenderElementProps ) => (
		<Element editor={ editor } { ...$props } mergeTags={ mergeTags } />
	);

	const toggleFormat = ( editor: Editor, format ) => {
		const isActive = isFormatActive( format );
		Transforms.setNodes(
			editor,
			{ [ format ]: isActive ? null : true },
			{ match: Text.isText, split: true }
		);
	};

	const Leaf = ( { attributes, children, leaf } ) => {
		if ( leaf.bold ) {
			children = <strong>{ children }</strong>;
		}

		if ( leaf.italic ) {
			children = <em>{ children }</em>;
		}

		return <span { ...attributes }>{ children }</span>;
	};

	// Insert Variable
	const insertMergeTag = ( mergeTag: MergeTag ) => {
		Transforms.insertNodes( editor, {
			type: 'mergeTag',
			data: {
				type: mergeTag.type,
				modifier: mergeTag.modifier,
			},
			children: [ { text: '' } ],
		} );
		setTimeout( () => {
			Transforms.move( editor );
		}, 0 );
	};

	const onKeyDown = useCallback(
		( event ) => {
			if ( target ) {
				switch ( event.key ) {
					case 'ArrowDown':
						event.preventDefault();
						const prevIndex =
							index >= $mergeTags.length - 1 ? 0 : index + 1;
						setIndex( prevIndex );
						break;
					case 'ArrowUp':
						event.preventDefault();
						const nextIndex =
							index <= 0 ? $mergeTags.length - 1 : index - 1;
						setIndex( nextIndex );
						break;
					case 'Tab':
					case 'Enter':
						event.preventDefault();
						Transforms.select( editor, target );
						insertMergeTag( $mergeTags[ index ] );
						setTarget( undefined );
						break;
					case 'Escape':
						event.preventDefault();
						setTarget( undefined );
						break;
				}
			}
		},
		[ index, search, target ]
	);

	useEffect( () => {
		if ( target && $mergeTags.length > 0 ) {
			const el: HTMLDivElement | null = ref.current;
			const domRange = ReactEditor.toDOMRange( editor, target );
			const rect = domRange.getBoundingClientRect();
			if ( el ) {
				el.style.top = `${ rect.top + window.pageYOffset + 24 }px`;
				el.style.left = `${ rect.left + window.pageXOffset }px`;
			}
		}
	}, [ $mergeTags.length, editor, index, search, target ] );

	useEffect( () => {
		/**
		 * Alert if clicked on outside of element
		 *
		 * @param event
		 */
		function handleClickOutsidePortal( event: MouseEvent ): void {
			if (
				wrapperRef.current &&
				ref.current &&
				! wrapperRef.current.contains( event.target as Node ) &&
				! ref.current.contains( event.target as Node )
			) {
				setTarget( undefined );
			}
		}

		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutsidePortal );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener(
				'mousedown',
				handleClickOutsidePortal
			);
		};
	}, [ ref ] );

	return (
		<Fragment>
			<div
				className="richtext__editor"
				style={ { width: '100%' } }
				ref={ wrapperRef }
			>
				<Slate
					editor={ editor }
					value={ value }
					onChange={ ( val ) => {
						onChange( val );
						const { selection } = editor;

						if ( selection && Range.isCollapsed( selection ) ) {
							const [ start ] = Range.edges( selection );
							const wordBefore = selection;
							const before =
								wordBefore &&
								Editor.before( editor, wordBefore );
							const beforeRange =
								before && Editor.range( editor, before, start );
							const beforeText =
								beforeRange &&
								Editor.string( editor, beforeRange );
							const beforeMatch =
								beforeText && beforeText.endsWith( '@' );
							const after = Editor.after( editor, start );
							const afterRange = Editor.range(
								editor,
								start,
								after
							);
							const afterText = Editor.string(
								editor,
								afterRange
							);
							const afterMatch = afterText.match( /^(\s|$)/ );

							if ( beforeMatch && afterMatch ) {
								setTarget( beforeRange );
								setSearch( beforeMatch[ 1 ] );
								setIndex( 0 );
							} else {
								setTarget( undefined );
							}
						}
					} }
				>
					{ formattingControls?.length > 0 && (
						<HoveringToolbar
							formattingControls={ formattingControls }
							toggleFormat={ ( format ) =>
								toggleFormat( editor, format )
							}
							isFormatActive={ ( format ) =>
								isFormatActive( format )
							}
						/>
					) }
					<Editable
						style={ { color } }
						color={ color }
						renderLeaf={ ( $props ) => <Leaf { ...$props } /> }
						renderElement={ renderElement }
						placeholder={ placeholder }
						onFocus={ onFocus }
						onKeyDown={ onKeyDown }
						onDOMBeforeInput={ ( event: Event ) => {
							// // // console.log(event.inputType);
							switch ( ( event as InputEvent ).inputType ) {
								case 'formatBold':
									return toggleFormat( editor, 'bold' );
								case 'formatItalic':
									return toggleFormat( editor, 'italic' );
							}
						} }
					/>
					{ target && $mergeTags.length > 0 && (
						<Portal>
							<div
								className="rich-text-merge-tag-list"
								ref={ ref }
								style={ {
									top: '-9999px',
									left: '-9999px',
									position: 'absolute',
									zIndex: 33,
									padding: '3px',
									background: 'white',
									borderRadius: '4px',
									boxShadow: '0 1px 5px rgba(0,0,0,.2)',
								} }
							>
								{ $mergeTags.map( ( mergeTag, i ) => (
									<MergeTagListItem
										key={ `merge-tag-${ i }` }
										mergeTag={ mergeTag }
										onClick={ () => {
											Transforms.select( editor, target );
											insertMergeTag( mergeTag );
											ReactEditor.focus( editor );
										} }
										onMouseEnter={ () => setIndex( i ) }
										isSelected={ index === i }
									/>
								) ) }
							</div>
						</Portal>
					) }
				</Slate>
			</div>
		</Fragment>
	);
};

/**
 * Export.
 */
export default TextEditor;
