/**
 * QuillForms Dependencies
 */
import {
	EditorLogicCondition,
	LogicConditionOperator,
} from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import ComboboxControl, {
	CustomizeFunction,
	CustomizeObject,
} from '../combobox-control';
import OperatorSelector from './operator-selector';
import TextControl from '../text-control';
import Button from '../button';

export type LogicConditionsProps = {
	value: EditorLogicCondition[][];
	onChange: ( value: EditorLogicCondition[][] ) => void;
	combobox?: {
		customize?: {
			handler: CustomizeFunction;
			override?: boolean;
		};
		excerptLength?: number;
	};
};

const LogicConditions: React.FC< LogicConditionsProps > = ( {
	value,
	onChange,
	combobox,
} ) => {
	const { blocks, blockTypes } = useSelect( ( select ) => {
		return {
			blocks: select( 'quillForms/block-editor' ).getBlocks(),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	// update value on mount if input isn't array or is empty array.
	useEffect( () => {
		if ( ! Array.isArray( value ) || value.length === 0 ) {
			onChange( [ [ { vars: [ {}, {} ] } ] ] );
		}
	}, [] );

	const customize = combobox?.customize?.override
		? combobox.customize.handler
		: ( customizable: CustomizeObject ) => {
				let { sections, options } = customizable;
				sections = sections.filter( ( section ) =>
					[ 'fields', 'variables', 'hidden_fields' ].includes(
						section.key
					)
				);
				options = options.filter( ( option ) => {
					if ( option.type === 'field' ) {
						const blockType =
							blockTypes[ option.other?.name ?? '' ];
						return (
							blockType?.supports?.logic &&
							blockType?.supports?.logicConditions
						);
					} else if (
						[ 'variable', 'hidden_field' ].includes( option.type )
					) {
						return true;
					} else {
						return false;
					}
				} );

				if ( combobox?.customize ) {
					const customized = combobox.customize.handler( {
						sections,
						options,
					} );
					sections = customized.sections;
					options = customized.options;
				}

				return { sections, options };
		  };

	if ( ! Array.isArray( value ) ) {
		return null;
	}

	return (
		<div className="logic-conditions">
			{ value.map( ( group, gi ) => (
				<div key={ gi }>
					<div className="logic-conditions__group">
						{ value.length > 1 && (
							<div className="group-remove">
								<Icon
									icon={ closeSmall }
									onClick={ () => {
										const $value = [ ...value ];
										$value.splice( gi, 1 );
										onChange( $value );
									} }
								/>
							</div>
						) }
						{ group.map( ( condition, ci ) => {
							const var0Type = condition.vars[ 0 ].type;
							const var0Value = condition.vars[ 0 ].value;
							const op = condition.op;
							const var1Value = condition.vars[ 1 ].value;

							// some properties for field type.
							let block;
							let blockType;
							if ( var0Type === 'field' ) {
								block = blocks.find(
									( block ) =>
										block.id === condition.vars[ 0 ].value
								);
								blockType = blockTypes[ block?.name ];
								if ( ! blockType ) {
									return null;
								}
							}

							// possible operators list.
							let operators:
								| LogicConditionOperator[]
								| null = null;
							if ( var0Type === 'field' ) {
								if ( blockType.logicalOperators ) {
									operators = blockType.logicalOperators;
								}
							} else if ( var0Type === 'variable' ) {
								operators = [
									'is',
									'is_not',
									'lower_than',
									'greater_than',
								];
							}
							if ( ! operators ) {
								operators = [
									'is',
									'is_not',
									'starts_with',
									'ends_with',
									'contains',
									'not_contains',
								];
							}

							let row1: any = null;
							let row2: any = null;

							// row1 render.
							row1 = (
								<div className="condition-row-1">
									<div className="condition-var0">
										<ComboboxControl
											excerptLength={
												combobox?.excerptLength ?? 30
											}
											value={ condition.vars[ 0 ] }
											onChange={ ( var0 ) => {
												const $value = [ ...value ];
												$value[ gi ][ ci ] = {
													vars: [ var0, {} ],
												};
												onChange( $value );
											} }
											isToggleEnabled={ false }
											customize={ customize }
											hideChooseOption={ true }
											selectFirstOption={ true }
										/>
									</div>
									<div className="condition-op">
										{ var0Value && (
											<OperatorSelector
												operators={ operators }
												value={ op ?? null }
												onChange={ ( op ) => {
													const $value = [ ...value ];
													$value[ gi ][ ci ].op = op;
													onChange( $value );
												} }
											/>
										) }
									</div>
								</div>
							);

							// row2 render.
							if ( var0Value ) {
								row2 = (
									<div className="condition-row-2">
										{ var0Type === 'field' &&
										blockType.logicControl ? (
											<blockType.logicControl
												attributes={ block.attributes }
												value={ var1Value }
												setValue={ ( var1 ) => {
													const $value = [ ...value ];
													$value[ gi ][
														ci
													].vars[ 1 ].value = var1;
													onChange( $value );
												} }
												removeCondition={ () => {
													const $value = [ ...value ];
													$value[ gi ].splice(
														ci,
														1
													);
													onChange( $value );
												} }
											/>
										) : var0Type === 'variable' ? (
											<TextControl
												type="number"
												value={ var1Value ?? '' }
												onChange={ ( var1 ) => {
													const $value = [ ...value ];
													$value[ gi ][
														ci
													].vars[ 1 ].value = var1;
													onChange( $value );
												} }
											/>
										) : (
											<TextControl
												value={ var1Value ?? '' }
												onChange={ ( var1 ) => {
													const $value = [ ...value ];
													$value[ gi ][
														ci
													].vars[ 1 ].value = var1;
													onChange( $value );
												} }
											/>
										) }
									</div>
								);
							}

							return (
								<div key={ ci }>
									<div className="logic-conditions__condition">
										<div className="condition-rows">
											{ row1 }
											{ row2 }
										</div>
										{ group.length > 1 && (
											<div>
												<div className="condition-remove">
													<Icon
														icon={ closeSmall }
														onClick={ () => {
															const $value = [
																...value,
															];
															$value[ gi ].splice(
																ci,
																1
															);
															onChange( $value );
														} }
													/>
												</div>
											</div>
										) }
									</div>
									{ group.length - 1 !== ci ? (
										<div>and</div>
									) : (
										<div className="logic-conditions__add-condition">
											<Button
												isPrimary
												onClick={ () => {
													const $value = [ ...value ];
													$value[ gi ].push( {
														vars: [ {}, {} ],
													} );
													onChange( $value );
												} }
											>
												and
											</Button>
										</div>
									) }
								</div>
							);
						} ) }
					</div>
					{ value.length - 1 !== gi ? (
						<div className="logic-conditions__or">- OR -</div>
					) : (
						<div className="logic-conditions__add-group">
							<Button
								isPrimary
								onClick={ () => {
									const $value = [ ...value ];
									$value.push( [ { vars: [ {}, {} ] } ] );
									onChange( $value );
								} }
							>
								OR
							</Button>
						</div>
					) }
				</div>
			) ) }
		</div>
	);
};

export default LogicConditions;
