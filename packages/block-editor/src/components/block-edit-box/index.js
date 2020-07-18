/**
 * QuillForms Dependencies
 */
import {
	__experimentalDraggable,
	BlockIconWrapper,
} from '@quillforms/builder-components';
import {
	__unstableCreateEditor as createEditor,
	__unstableInsertNodes as insertNodes,
	__unstableInsertText as insertText,
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

/**
 * External Dependencies
 */
import { InView } from 'react-intersection-observer';

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
		prevProps.item.description === nextProps.item.description
	)
		return true;
	return false;
};

const BlockEditBox = memo( ( props ) => {
	const { item, block, index } = props;

	const { id, attachment, description, title, type } = item;

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

	// Insert Variable
	const insertVariable = ( variable, path ) => {
		let editor = titleEditor;
		if ( focusOn === 'desc' ) {
			editor = descEditor;
		}
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

	// Insert Emoji
	const insertEmoji = ( emoji, path ) => {
		let editor = titleEditor;
		if ( focusOn === 'desc' ) {
			editor = descEditor;
		}
		insertText( editor, emoji.native, { at: path } );
	};

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
				withVariables: true,
				withHistory: true,
				withLinks: true,
			} ),
		[]
	);

	const descEditor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withVariables: true,
				withHistory: true,
				withLinks: true,
			} ),
		[]
	);

	let category = 'fields';
	let isDragDisabled = false;

	if ( type === 'welcome-screen' ) {
		category = 'welcomeScreens';
		isDragDisabled = true;
	} else if ( type === 'thankyou-screen' ) {
		category = 'thankyouScreens';
	}

	return (
		<InView>
			{ ( { inView, ref } ) => (
				<__experimentalDraggable
					isDragDisabled={ isDragDisabled || ! inView }
					key={ id }
					draggableId={ id }
					index={ index }
				>
					{ ( provided, snapshot ) => (
						<div
							ref={ ref }
							className="block-editor-block-edit-box"
						>
							<BoxWrapper id={ id } category={ category }>
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
													category={ category }
												/>
												<BlockEditor
													attachment={ attachment }
													focusOn={ focusOn }
													setFocusOn={ setFocusOn }
													id={ id }
													index={ index }
													blockColor={
														block.editorConfig.color
													}
													category={ category }
													title={ titleJsonVal }
													addDesc={
														description !==
														undefined
													}
													desc={ descJsonVal }
													titleEditor={ titleEditor }
													setTitleJsonVal={ (
														value
													) =>
														setTitleJsonVal( value )
													}
													descEditor={ descEditor }
													setDescJsonVal={ (
														value
													) =>
														setDescJsonVal( value )
													}
													insertVariable={
														insertVariable
													}
													insertEmoji={ insertEmoji }
												/>
											</Fragment>
										) : (
											<Fragment>
												<BlockIconWrapper
													color={
														block.editorConfig.color
													}
												/>
												<BlockPlaceholder />
											</Fragment>
										) }
									</div>
								</div>
							</BoxWrapper>
						</div>
					) }
				</__experimentalDraggable>
			) }
		</InView>
	);
}, areEqual );

export default BlockEditBox;
