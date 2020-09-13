/**
 * QuillForms Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';
/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { Popover } from '@material-ui/core';

/**
 * Internal Dependencies
 */
import BlockIconBox from '../block-icon-box';

const RecallInformation = ( {
	variables,
	insertVariable,
	anchorEl,
	setAnchorEl,
	onClose,
} ) => {
	const { blocks, editableFields } = useSelect( ( select ) => {
		return {
			blocks: select( 'quillForms/blocks' ).getBlocks(),
			editableFields: select(
				'quillForms/block-editor'
			).getEditableFields(),
		};
	} );

	const open = Boolean( anchorEl );
	const popoverId = open ? 'variables-popover' : undefined;

	const variableClickHandler = ( variable ) => {
		setAnchorEl( null );
		insertVariable( variable );
	};
	return (
		<Popover
			id={ popoverId }
			open={ open }
			anchorEl={ anchorEl }
			onClose={ onClose }
			anchorOrigin={ {
				vertical: 'bottom',
				horizontal: 'center',
			} }
			transformOrigin={ {
				vertical: 'top',
				horizontal: 'center',
			} }
			className="builder-components-recall-information__popover"
		>
			<div className="builder-components-recall-information">
				{ variables?.length > 0 ? (
					<Fragment>
						<div className="builder-components-recall-information__heading">
							Recall Information From:
						</div>
						<div className="builder-components-recall-information__list">
							{ [ ...variables ].map( ( variable ) => {
								let color = '#3a7685';
								let blockType = null;
								let blockOrder = null;
								if ( variable.varType === 'field' ) {
									const fieldObj = editableFields.find(
										( field ) => field.id === variable.ref
									);
									blockType = fieldObj.type;
									blockOrder =
										editableFields.findIndex(
											( field ) =>
												field.id === variable.ref
										) + 1;
									color =
										blocks[ blockType ].editorConfig.color;
								}
								return (
									<div
										role="presentation"
										key={
											variable.type + '_' + variable.value
										}
										className="builder-components-recall-information__list-item"
										onClick={ () =>
											variableClickHandler( variable )
										}
									>
										<div
											style={ {
												background: color,
											} }
											className="builder-components-recall-information__list-item-hidden-bg"
										/>
										<BlockIconBox
											blockType={
												variable.varType === 'field'
													? blockType
													: 'variable'
											}
											blockOrder={
												variable.varType === 'field'
													? blockOrder
													: null
											}
										/>
										<div
											className="builder-components-recall-informationــlist-item-title"
											dangerouslySetInnerHTML={ {
												__html: getPlainExcerpt(
													variable.title
												),
											} }
										/>
									</div>
								);
							} ) }
						</div>
					</Fragment>
				) : (
					<div className="builder-components-recall-information__no-blocks">
						<h5 className="builder-components-recall-information__no-blocks-heading">
							There is no information to call yet
						</h5>
						<div className="builder-components-recall-information__no-blocks-content">
							To recall information, you need a question before
							this one.
						</div>
					</div>
				) }
			</div>
		</Popover>
	);
};

export default RecallInformation;
