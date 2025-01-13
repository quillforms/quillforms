/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlLabel,
	ControlWrapper,
	getPlainExcerpt,
	RichTextControl,

} from '@quillforms/admin-components';

import { FullRichText } from '@quillforms/rich-text';
/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import AlertMessageWrapper from '../alert-message-wrapper';

const EmailMessage = ({
	isReviewing,
	isValid,
	setIsValid,
	value,
	setValue,
}) => {
	useEffect(() => {
		if (value && value.length > 0) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [value]);
	const { fields, quizMode } = useSelect((select) => {
		const blockTypes = select('quillForms/blocks').getBlockTypes();
		return {
			fields: select('quillForms/block-editor')
				.getAllBlocks()
				.filter(($block) => {
					const blockType = blockTypes[$block.name];
					return blockType?.supports?.editable === true;
				})
				.map((field) => {
					return {
						type: 'field',
						modifier: field.id,
						label: getPlainExcerpt(field.attributes.label),
						icon: blockTypes[field.name]?.icon,
						color: blockTypes[field.name]?.color,
						order: select(
							'quillForms/block-editor'
						).getBlockOrderById(field.id),
					};
				}),
			quizMode: select('quillForms/quiz-editor').getState().enabled
		};
	});

	let mergeTags = [
		{
			type: 'form',
			modifier: 'all_answers',
			value: 'all_answers',
			label: __('all_answers', 'quillforms'),
		},
	];
	if (quizMode) {
		mergeTags = [
			{
				type: 'quiz',
				label: __('Correct Answers Count', 'quillforms'),
				modifier: 'correct_answers_count',
				value: 'correct_answers_count',
				icon: 'yes',
				color: '#4caf50',
				order: undefined,
			},
			{
				type: 'quiz',
				label: __('Incorrect Answers Count', 'quillforms'),
				modifier: 'incorrect_answers_count',
				value: 'incorrect_answers_count',
				icon: 'no-alt',
				color: '#f44336',
				order: undefined,
			},
			{
				type: 'quiz',
				label: __('Quiz Summary', 'quillforms'),
				modifier: 'summary',
				value: 'summary',
				icon: 'editor-table',
				color: '#4caf50',
				order: undefined,
			}
		];
	}

	// mergeTags = mergeTags.concat(
	// 	applyFilters('QuillForms.Builder.MergeTags', [])
	// );

	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label={__('Message', 'quillforms')} showAsterisk={true} />
				<FullRichText value={value || '<p></p>'}
					onChange={(newVal) => {
						setValue(newVal);
					}}
					customMergeTags={mergeTags}
				/>
				{/* <RichTextControl
					className={css`
						min-height: 120px !important;
					` }
					mergeTags={mergeTags}
					value={value}
					setValue={(newVal) => {
						setValue(newVal);
					}}
					allowedFormats={['bold', 'italic', 'link']}
				/> */}
			</ControlWrapper>
			{!isValid && isReviewing && (
				<AlertMessageWrapper type="error">
					{__('This field is required!', 'quillforms')}
				</AlertMessageWrapper>
			)}
		</BaseControl>
	);
};
export default EmailMessage;
