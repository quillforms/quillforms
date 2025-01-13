/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from 'react';
import { plus, closeSmall } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const SingleRangeSliderControl = ({ attributes, setAttributes }) => {

	const marksOptions = [{
		key: 'no',
		name: __('No', 'quillforms'),
	}, {
		key: 'yes',
		name: __('Yes', 'quillforms'),
	}, {
		key: 'custom',
		name: __('Custom', 'quillforms'),
	}
	];
	const { min, max, step, prefix, suffix, marks, customMarks } = attributes;

	const addItem = (index) => {
		const newItem = { label: "", value: "" };
		setAttributes({
			customMarks: [
				...attributes.customMarks.slice(0, index),
				newItem,
				...attributes.customMarks.slice(index),
			],
		});
	};


	const deleteItem = (index) => {
		const newMarks = [...customMarks];
		newMarks.splice(index, 1);
		setAttributes({
			customMarks: newMarks
		});
	};

	const updateItem = (index, field, value) => {
		const newMarks = [...customMarks];
		newMarks[index][field] = value;
		setAttributes({
			customMarks: newMarks
		});
	};

	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Min', 'quillforms')} />
					<TextControl type="number" value={min} onChange={val => {
						if (!isNaN(val)) {
							setAttributes({ min: val })
						}
					}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Max', 'quillforms')} />
					<TextControl type="number" value={max}
						onChange={val => {
							if (!isNaN(val)) {
								setAttributes({ max: val })
							}
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Step', 'quillforms')} />
					<TextControl type="number" value={step} onChange={val => {
						if (!isNaN(val)) {
							setAttributes({ step: val })
						}
					}
					} />
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Marks', 'quillforms')} />
					<SelectControl
						value={marksOptions.find((option) => option.key === marks)}
						onChange={(selectedChoice) => {
							if (selectedChoice && selectedChoice.selectedItem) {
								setAttributes({
									marks: selectedChoice.selectedItem.key
								})
							}
						}}
						options={marksOptions}
					/>
				</ControlWrapper>
				{marks === 'custom' && (
					<>
						{customMarks.map((item, index) => (
							<div className="admin-components-choices-inserter__choice-row" key={index}>
								<TextControl
									type="number"
									value={item.value}
									onChange={(val) => updateItem(index, "value", val)}
									placeholder={__('value', 'quillforms')}
								/>
								<TextControl
									type="text"
									value={item.label}
									onChange={(val) => updateItem(index, "label", val)}
									placeholder={__('label', 'quillforms')}
								/>
								<div className="admin-components-choices-inserter__choice-actions">
									<div className="admin-components-choices-inserter__choice-add">
										<Icon
											icon={plus}
											onClick={() => addItem(index + 1)}
										/>
									</div>
									{customMarks.length > 1 && (
										<div className="admin-components-choices-inserter__choice-remove">
											<Icon
												className={css`
								fill: #fff;
							` }
												icon={closeSmall}
												onClick={() => deleteItem(index)}
											/>
										</div>
									)}
								</div>
							</div>
						))}

					</>
				)}
			</BaseControl>

			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Prefix', 'quillforms')} />
					<TextControl value={prefix} onChange={val => setAttributes({ prefix: val })} />
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Suffix', 'quillforms')} />
					<TextControl value={suffix} onChange={val => setAttributes({ suffix: val })} />
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default SingleRangeSliderControl;
