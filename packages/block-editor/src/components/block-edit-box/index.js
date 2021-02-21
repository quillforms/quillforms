/**
 * QuillForms Dependencies
 */
import {
	__experimentalDraggable,
	BlockIconWrapper,
} from '@quillforms/admin-components';
import {
	__unstableCreateEditor as createEditor,
	__unstableHtmlDeserialize as deserialize,
} from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import {
	Fragment,
	memo,
	useEffect,
	useState,
	useMemo,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { useInView } from 'react-intersection-observer';

/**
 * Internal Dependencies
 */
import BoxWrapper from './box-wrapper';
import BlockEditor from '../block-edit';
import BlockPlaceholder from '../block-placeholder';
import BlockMover from '../block-mover';

const areEqual = ( prevProps, nextProps ) => {
	if ( prevProps.index === nextProps.index ) return true;
	return false;
};

const BlockEditBox = memo( ( props ) => {
	const { id, index, name } = props;

	const [ ref, inView, entry ] = useInView( {
		/* Optional options */
		threshold: 0,
	} );
	const { isSelected, block, blockType } = useSelect( ( select ) => {
		return {
			block: select( 'quillForms/block-editor' ).getBlockById( id ),
			blockType: select( 'quillForms/blocks' ).getBlockType( name ),
			isSelected:
				select( 'quillForms/block-editor' ).getCurrentBlockId() === id,
		};
	} );
	const { attributes } = block;
	const { label, description } = attributes;

	const [ labelJsonVal, setLabelJsonVal ] = useState( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const [ descJsonVal, setDescJsonVal ] = useState( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const [ focusOn, setFocusOn ] = useState( false );

	const getDeserializedValue = ( val ) => {
		return deserialize( val );
	};

	// Deserialize value on mount
	useEffect( () => {
		setLabelJsonVal( getDeserializedValue( label ) );
		if ( !! description )
			setDescJsonVal( getDeserializedValue( description ) );
	}, [] );

	const labelEditor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withMergeTags: true,
				withHistory: true,
				withLinks: true,
			} ),
		[]
	);

	const descEditor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withMergeTags: true,
				withHistory: true,
				withLinks: true,
			} ),
		[]
	);

	const isDragDisabled = false;

	return (
		<div ref={ ref }>
			<__experimentalDraggable
				isDragDisabled={
					isDragDisabled || ! inView || name === 'welcome-screen'
				}
				key={ id }
				draggableId={ id.toString() }
				index={ index }
			>
				{ ( provided, snapshot ) => (
					<BoxWrapper id={ id }>
						<div className="block-editor-block-edit-box__content-wrapper">
							<div
								className="block-editor-block-edit-box__content"
								{ ...provided.draggableProps }
								ref={ provided.innerRef }
								isDragging={ snapshot.isDragging }
								style={ provided.draggableProps.style }
							>
								{ inView ? (
									<Fragment>
										<BlockMover
											dragHandleProps={ {
												...provided.dragHandleProps,
											} }
											id={ id }
											blockType={ blockType }
										/>
										<BlockEditor
											isSelected={ isSelected }
											attributes={ attributes }
											focusOn={ focusOn }
											setFocusOn={ setFocusOn }
											id={ id }
											index={ index }
											blockColor={ blockType?.color }
											label={ labelJsonVal }
											desc={ descJsonVal }
											labelEditor={ labelEditor }
											setLabelJsonVal={ ( value ) =>
												setLabelJsonVal( value )
											}
											descEditor={ descEditor }
											setDescJsonVal={ ( value ) =>
												setDescJsonVal( value )
											}
										/>
									</Fragment>
								) : (
									<Fragment>
										<BlockIconWrapper
											color={ blockType?.color }
										/>
										<BlockPlaceholder />
									</Fragment>
								) }
							</div>
						</div>
					</BoxWrapper>
				) }
			</__experimentalDraggable>
		</div>
	);
}, areEqual );

export default BlockEditBox;
