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
import { Transforms, Text, Editor, Range } from 'slate';
import { Slate, Editable, ReactEditor } from 'slate-react';
/**
 * Internal Dependencies
 */
import Element from '../element';
import HoveringToolbar from '../hovering-toolbar';
import MergeTagListItem from '../merge-tag-list-item';
import Portal from '../portal';

const TextEditor = ( props ) => {
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

	const wrapperRef = useRef();
	const ref = useRef();
	const [ target, setTarget ] = useState();
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

	const renderElement = ( $props ) => (
		<Element editor={ editor } { ...$props } mergeTags={ mergeTags } />
	);

	const toggleFormat = ( format ) => {
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
	const insertMergeTag = ( mergeTag ) => {
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
						setTarget( null );
						break;
					case 'Escape':
						event.preventDefault();
						setTarget( null );
						break;
				}
			}
		},
		[ index, search, target ]
	);

	useEffect( () => {
		if ( target && $mergeTags.length > 0 ) {
			const el = ref.current;
			const domRange = ReactEditor.toDOMRange( editor, target );
			const rect = domRange.getBoundingClientRect();
			el.style.top = `${ rect.top + window.pageYOffset + 24 }px`;
			el.style.left = `${ rect.left + window.pageXOffset }px`;
		}
	}, [ $mergeTags.length, editor, index, search, target ] );

	useEffect( () => {
		/**
		 * Alert if clicked on outside of element
		 *
		 * @param event
		 */
		function handleClickOutsidePortal( event ) {
			if (
				wrapperRef.current &&
				ref.current &&
				! wrapperRef.current.contains( event.target ) &&
				! ref.current.contains( event.target )
			) {
				setTarget( null );
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
								setTarget( null );
							}
						}
					} }
				>
					{ formattingControls?.length > 0 && (
						<HoveringToolbar
							formattingControls={ formattingControls }
							toggleFormat={ ( format ) =>
								toggleFormat( format )
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
						onDOMBeforeInput={ ( event ) => {
							// // console.log(event.inputType);
							switch ( event.inputType ) {
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
