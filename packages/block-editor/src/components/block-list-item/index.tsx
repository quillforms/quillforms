/**
 * QuillForms Dependencies
 */
import {
	__experimentalDraggable,
	BlockIconWrapper,
	__unstableCreateEditor as createEditor,
	__unstableHtmlDeserialize as deserialize,
} from '@quillforms/admin-components';

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
// @ts-expect-error
import { useSelect, AsyncModeProvider } from '@wordpress/data';

/**
 * External Dependencies
 */
import { useInView } from 'react-intersection-observer';
import { Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

/**
 * Internal Dependencies
 */
import BoxWrapper from '../box-wrapper';
import BlockEditor from '../block-edit';
import BlockPlaceholder from '../block-placeholder';
import BlockMover from '../block-mover';
import BlockEditCrashBoundary from '../block-edit-crash-boundary';
import BlockEditCrashWarning from '../block-edit-crash-warning';

// const areEqual = ( prevProps: Props, nextProps: Props ) => {
// 	if ( prevProps.index === nextProps.index ) return true;
// 	return false;
// };

export type FocusedEl = 'label' | 'desc' | undefined;

interface Props {
	id: string;
	index: number;
	name: string;
}

const BlockListItem: React.FC< Props > = memo( ( { id, index, name } ) => {
	const [ ref, inView ] = useInView( {
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

	if ( ! block || ! blockType ) return null;
	const { attributes } = block;

	const label = attributes?.label ? attributes.label : '';
	const description = attributes?.label ? attributes.description : '';

	const [ labelJsonVal, setLabelJsonVal ] = useState< Node[] >( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const [ descJsonVal, setDescJsonVal ] = useState< Node[] >( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const [ focusedEl, setFocusedEl ] = useState< FocusedEl >( undefined );
	// Handling the error state
	const [ hasError, setErrorState ] = useState< boolean >( false );

	const getDeserializedValue = ( val ) => {
		return deserialize( val );
	};

	// Deserialize value on mount
	useEffect( () => {
		setLabelJsonVal( getDeserializedValue( label ) );
		if ( !! description )
			setDescJsonVal( getDeserializedValue( description ) );
	}, [] );

	const labelEditor: ReactEditor & HistoryEditor = useMemo(
		() => createEditor(),
		[]
	);

	const descEditor: ReactEditor & HistoryEditor = useMemo(
		() => createEditor(),
		[]
	);

	if ( hasError ) {
		return <BlockEditCrashWarning />;
	}
	const isDragDisabled = false;

	return (
		<AsyncModeProvider value={ ! isSelected }>
			<div ref={ ref }>
				<BlockEditCrashBoundary onError={ () => setErrorState( true ) }>
					<__experimentalDraggable
						isDragDisabled={
							isDragDisabled ||
							! inView ||
							name === 'welcome-screen'
						}
						key={ id }
						draggableId={ id.toString() }
						index={ index }
					>
						{ ( provided, _snapshot ) => (
							<BoxWrapper id={ id }>
								<div className="block-editor-block-edit-box__content-wrapper">
									<div
										className="block-editor-block-edit-box__content"
										{ ...provided.draggableProps }
										ref={ provided.innerRef }
										style={ provided.draggableProps.style }
									>
										{ inView ? (
											<Fragment>
												<BlockMover
													handleProps={
														provided?.dragHandleProps
															? {
																	...provided.dragHandleProps,
															  }
															: undefined
													}
													id={ id }
													blockType={ blockType }
												/>
												<BlockEditor
													isSelected={ isSelected }
													attributes={ attributes }
													focusedEl={ focusedEl }
													setFocusedEl={ ( val ) =>
														setFocusedEl( val )
													}
													id={ id }
													blockColor={
														blockType?.color
													}
													label={ labelJsonVal }
													desc={ descJsonVal }
													labelEditor={ labelEditor }
													setLabelJsonVal={ (
														value
													) =>
														setLabelJsonVal( value )
													}
													descEditor={ descEditor }
													setDescJsonVal={ (
														value
													) =>
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
				</BlockEditCrashBoundary>
			</div>
		</AsyncModeProvider>
	);
} );

export default BlockListItem;
