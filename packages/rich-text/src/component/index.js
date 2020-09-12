/**
 * WordPress Dependencies
 */
import { Fragment, useCallback } from '@wordpress/element';

/**
 * External Dependencies
 */
import { Transforms, Text, Editor } from 'slate';
import { Slate, Editable } from 'slate-react';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Internal Dependencies
 */
import Element from './element';
import HoveringToolbar from './hovering-toolbar';

const TextEditor = ( props ) => {
	const {
		editor,
		placeholder,
		color,
		onChange,
		value,
		onFocus,
		formattingControls = [ 'bold', 'italic' ],
	} = props;

	const isFormatActive = ( format ) => {
		const [ match ] = Editor.nodes( editor, {
			match: ( n ) => n[ format ] === true,
			mode: 'all',
		} );
		return !! match;
	};

	const renderElement = useCallback(
		( $props ) => <Element editor={ editor } { ...$props } />,
		[]
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

	return (
		<Fragment>
			<div className="richtext__editor" style={ { width: '100%' } }>
				<Slate
					editor={ editor }
					value={ cloneDeep( value ) }
					onChange={ ( val ) => {
						onChange( val );
					} }
				>
					<HoveringToolbar
						formattingControls={ formattingControls }
						toggleFormat={ ( format ) => toggleFormat( format ) }
						isFormatActive={ ( format ) =>
							isFormatActive( format )
						}
					/>
					<Editable
						style={ { color } }
						color={ color }
						renderLeaf={ ( $props ) => <Leaf { ...$props } /> }
						renderElement={ renderElement }
						placeholder={ placeholder }
						onFocus={ onFocus }
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
				</Slate>
			</div>
		</Fragment>
	);
};

/**
 * Export.
 */
export default TextEditor;
