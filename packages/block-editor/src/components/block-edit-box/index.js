/**
 * QuillForms Dependencies
 */
import {
	__experimentalDraggable,
	BlockIconWrapper,
} from '@quillforms/builder-components';
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
	if (
		prevProps.index === nextProps.index &&
		prevProps.item.attachment === nextProps.item.attachment &&
		prevProps.item.description === nextProps.item.description &&
		prevProps.isSelected === nextProps.isSelected
	)
		return true;
	return false;
};

const BlockEditBox = memo( ( props ) => {
	const { item, block, index } = props;

	const { id, attachment, description, title, type } = item;

	const [ ref, inView, entry ] = useInView( {
		/* Optional options */
		threshold: 0,
	} );
	const { isSelected } = useSelect( ( select ) => {
		return {
			isSelected:
				select( 'quillForms/block-editor' ).getCurrentBlockId() === id,
		};
	} );

	const [ titleJsonVal, setTitleJsonVal ] = useState( [
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
		setTitleJsonVal( getDeserializedValue( title ) );
		if ( !! description )
			setDescJsonVal( getDeserializedValue( description ) );
	}, [] );

	const titleEditor = useMemo(
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
					isDragDisabled || ! inView || type === 'welcome-screen'
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
											type={ type }
											id={ id }
											registeredBlock={ block }
										/>
										<BlockEditor
											isSelected={ isSelected }
											attachment={ attachment }
											focusOn={ focusOn }
											setFocusOn={ setFocusOn }
											id={ id }
											index={ index }
											blockColor={
												block?.editorConfig?.color
											}
											title={ titleJsonVal }
											addDesc={
												description !== undefined
											}
											desc={ descJsonVal }
											titleEditor={ titleEditor }
											setTitleJsonVal={ ( value ) =>
												setTitleJsonVal( value )
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
											color={ block?.editorConfig?.color }
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
