/**
 * QuillForms Dependencies
 */
import {
	__experimentalEditor as TextEditor,
	__unstableHtmlSerialize as serialize,
	__unstableReactEditor as ReactEditor,
} from '@quillforms/admin-components';
import type { BlockAttributes } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useCallback, useMemo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import { Node } from 'slate';
import { HistoryEditor } from 'slate-history';

/**
 * Internal Dependencies
 */
import BlockToolbar from '../block-toolbar';
import BlockAttachment from '../block-attachment';
import type { FocusedEl } from '../block-list-item';

interface Props {
	attributes?: BlockAttributes;
	id: string;
	blockColor?: string;
	label: Node[];
	desc: Node[];
	labelEditor: ReactEditor & HistoryEditor;
	descEditor: ReactEditor & HistoryEditor;
	isSelected: boolean;
	focusedEl: FocusedEl;
	setFocusedEl: ( value: FocusedEl ) => void;
	setLabelJsonVal: ( value: Node[] ) => void;
	setDescJsonVal: ( value: Node[] ) => void;
}
const BlockEdit: React.FC< Props > = ( props ) => {
	const { setBlockAttributes, setCurrentBlock } = useDispatch(
		'quillForms/block-editor'
	);

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
		focusedEl,
		setFocusedEl,
		isSelected,
	} = props;
	let attachment;

	if ( attributes?.attachment ) {
		attachment = attributes.attachment;
	}
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	const { prevFields } = useSelect( ( select ) => {
		return {
			prevFields: select(
				'quillForms/block-editor'
			).getPreviousEditableFieldsWithOrder( id ),
		};
	} );

	let mergeTags = prevFields.map( ( field ) => {
		return {
			type: 'field',
			label: field?.attributes?.label,
			modifier: field.id,
			icon: blockTypes[ field.name ]?.icon,
			color: blockTypes[ field.name ]?.color,
			order: field.order,
		};
	} );
	mergeTags = mergeTags.concat(
		applyFilters( 'QuillForms.Builder.MergeTags', [] ) as any[]
	);

	let currentEditor = labelEditor;
	if ( focusedEl === 'desc' ) {
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
			if ( focusedEl === 'label' || ! focusedEl ) {
				ReactEditor.focus( labelEditor );
			} else if ( focusedEl === 'desc' ) {
				ReactEditor.focus( descEditor );
			}
		}
	}, [ isSelected ] );

	// Title Change Handler
	const labelChangeHandler = ( value: Node[] ) => {
		if ( JSON.stringify( value ) !== JSON.stringify( label ) ) {
			setLabelJsonVal( value );
			serializeLabel( value );
		}
	};

	// Description Change Handler
	const descChangeHandler = ( value ) => {
		if ( JSON.stringify( value ) !== JSON.stringify( desc ) ) {
			setDescJsonVal( value );
			serializeDesc( value );
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
						setCurrentBlock( id );
						setFocusedEl( 'label' );
					} }
					allowedFormats={ [ 'bold', 'italic', 'link' ] }
				/>
			</div>
		),
		[ JSON.stringify( label ), JSON.stringify( mergeTags ) ]
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
						setCurrentBlock( id );
						setFocusedEl( 'desc' );
					} }
					allowedFormats={ [ 'bold', 'italic', 'link' ] }
				/>
			</div>
		),
		[ JSON.stringify( desc ), JSON.stringify( mergeTags ) ]
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
		</div>
	);
};

export default BlockEdit;
