
import {
	ComboboxControl,
	SelectControl,
	TextControl,
	Button,
} from '@quillforms/admin-components';
import { useState, useEffect } from '@wordpress/element';
import TrashIcon from '../icons/trash-icon';
import ConfirmDeleteModal from './confirm-delete-modal';

const LogicCondition = ({ value, onChange, combobox, fieldFilter }) => {
	const [pendingDelete, setPendingDelete] = useState(null);

	// Match admin LogicConditions: persist default group when parent passes [].
	useEffect(() => {
		if (!Array.isArray(value) || value.length === 0) {
			onChange([[{ vars: [{}, {}], op: 'is' }]]);
		}
	}, []);

	const safeValue =
		Array.isArray(value) && value.length > 0
			? value
			: [[{ vars: [{}, {}], op: 'is' }]];

	const operatorOptions = [
		{ key: 'is', name: 'is equal to' },
		{ key: 'is_not', name: 'is not equal to' },
		{ key: 'contains', name: 'contains' },
		{ key: 'not_contains', name: 'not contains' },
		{ key: 'starts_with', name: 'starts with' },
		{ key: 'ends_with', name: 'ends with' },
		{ key: 'greater_than', name: 'greater than' },
		{ key: 'lower_than', name: 'lower than' },
	];

	const updateCondition = (groupIndex, conditionIndex, patch) => {
		const next = [...safeValue];
		next[groupIndex] = [...next[groupIndex]];
		next[groupIndex][conditionIndex] = {
			...next[groupIndex][conditionIndex],
			...patch,
		};
		onChange(next);
	};

	const removeCondition = (groupIndex, conditionIndex) => {
		const next = [...safeValue];
		next[groupIndex] = [...next[groupIndex]];
		next[groupIndex].splice(conditionIndex, 1);
		if (next[groupIndex].length === 0) {
			next.splice(groupIndex, 1);
		}
		onChange(next.length > 0 ? next : []);
	};

	const addCondition = (groupIndex) => {
		const next = [...safeValue];
		next[groupIndex] = [...next[groupIndex], { vars: [{}, {}], op: 'is' }];
		onChange(next);
	};

	const addGroup = () => {
		onChange([...safeValue, [{ vars: [{}, {}], op: 'is' }]]);
	};

	const comboboxCustomize = combobox?.customize;
	const effectiveComboboxCustomize = comboboxCustomize
		? comboboxCustomize.override
			? comboboxCustomize.handler
			: (input) => {
					let { sections, options } = input;

					sections = (sections ?? []).filter((section) =>
						['fields', 'variables', 'hidden_fields'].includes(section.key)
					);

					options = (options ?? []).filter((option) => {
						if (option.type === 'field') return true;
						if (['variable', 'hidden_field'].includes(option.type)) return true;
						return false;
					});

					return comboboxCustomize.handler({ sections, options });
			  }
		: fieldFilter?.$blocks
			? (input) => {
					const { sections, options } = input;
					const { $blocks, blockIndex } = fieldFilter;
					const nextOptions = (options ?? []).filter((option) => {
						if (option.type === 'field') {
							return (
								blockIndex >=
								$blocks.findIndex((block) => block.id === option.value)
							);
						}
						return true;
					});

					return { sections, options: nextOptions };
			  }
			: undefined;

	return (
		<div className="logic-editor-logic-conditions">
			<div
				className={
					'logic-editor-logic-conditions__groups' +
					(safeValue.length > 1 ? ' has-or-group' : '')
				}
			>
				{safeValue.length > 1 && (
					<div className="logic-editor-logic-conditions__or-connector">
						<span className="logic-editor-logic-conditions__or-chip">
							OR
						</span>
					</div>
				)}
				{safeValue.map((group, groupIndex) => (
					<div
						key={groupIndex}
						className={
							'logic-editor-logic-conditions__group-row' +
							(safeValue.length > 1 ? ' has-or-group' : '')
						}
					>
						<div
							className={
								'logic-editor-logic-conditions__group' +
								(group.length > 1
									? ' logic-editor-logic-conditions__group--has-and'
									: '')
							}
						>
							{group.length > 1 && (
								<div className="logic-editor-logic-conditions__group-and-connector">
									<span className="logic-editor-logic-conditions__and-chip">
										AND
									</span>
								</div>
							)}
							{group.map((condition, conditionIndex) => (
								<div
									key={conditionIndex}
									className="logic-editor-logic-conditions__condition-item"
								>
									<div
										className={
											'logic-editor-logic-conditions__row' +
											(group.length > 1 ? ' has-and-group' : '')
										}
									>
										<div className="logic-editor-logic-conditions__row-top">
											<div className="logic-editor-logic-conditions__field">
												<ComboboxControl
													value={condition?.vars?.[0] ?? {}}
													onChange={(var0) => {
														updateCondition(groupIndex, conditionIndex, {
															vars: [var0, condition?.vars?.[1] ?? {}],
														});
													}}
													isToggleEnabled={false}
													hideChooseOption={true}
													selectFirstOption={true}
													customize={effectiveComboboxCustomize}
													excerptLength={combobox?.excerptLength ?? 30}
												/>
											</div>
											<div className="logic-editor-logic-conditions__operator">
												<SelectControl
													label=""
													options={operatorOptions}
													value={
														operatorOptions.find(
															(o) => o.key === (condition?.op ?? 'is')
														) ?? operatorOptions[0]
													}
													onChange={({ selectedItem }) => {
														updateCondition(groupIndex, conditionIndex, {
															op: selectedItem?.key ?? 'is',
														});
													}}
												/>
											</div>
											<button
												type="button"
												className="logic-editor-logic-conditions__delete-one"
												onClick={() =>
													setPendingDelete({
														type: 'row',
														groupIndex,
														conditionIndex,
													})
												}
											>
												<TrashIcon color="#E13B3B" width={24} height={24} />
											</button>
										</div>
										<div className="logic-editor-logic-conditions__row-bottom">
											<TextControl
												placeholder="Title"
												value={condition?.vars?.[1]?.value ?? ''}
												onChange={(nextValue) => {
													updateCondition(groupIndex, conditionIndex, {
														vars: [
															condition?.vars?.[0] ?? {},
															{
																...(condition?.vars?.[1] ?? {}),
																value: nextValue,
															},
														],
													});
												}}
											/>
										</div>
									</div>
								</div>
							))}
							<div className="logic-editor-logic-conditions__group-actions">
								<Button onClick={() => addCondition(groupIndex)}>AND</Button>
								<button
									type="button"
									className={
										'logic-editor-logic-conditions__group-delete-all' +
										(group.length === 1 ? ' is-single' : '')
									}
									onClick={() => setPendingDelete({ type: 'all' })}
								>
									<TrashIcon
										color={group.length === 1 ? '#777777' : '#E13B3B'}
										width={24}
										height={24}
									/>
									{group.length === 1
										? 'Delete condition'
										: 'Delete all conditions'}
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="logic-editor-logic-conditions__footer">
				<Button
					className="logic-editor-logic-conditions__or-btn"
					onClick={addGroup}
				>
					OR
				</Button>
			</div>
			{pendingDelete && (
				<ConfirmDeleteModal
					title={
						pendingDelete.type === 'all'
							? 'Delete all conditions'
							: 'Delete this condition'
					}
					message={
						pendingDelete.type === 'all'
							? 'Do you want to delete all conditions?'
							: 'Do you want to delete this condition?'
					}
					onCancel={() => setPendingDelete(null)}
					onConfirm={() => {
						if (pendingDelete.type === 'all') {
							onChange([]);
						} else {
							removeCondition(
								pendingDelete.groupIndex,
								pendingDelete.conditionIndex
							);
						}
						setPendingDelete(null);
					}}
				/>
			)}
		</div>
	);
};

export default LogicCondition;
