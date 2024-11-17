/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { TailSpin as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import Button from '../button';
import { useFormContext, useMessages } from '../../hooks';
import { set, size } from 'lodash';
import classnames from "classnames";

const SaveBtn: React.FC = () => {

	const messages = useMessages();

	const [isSaving, setIsSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const { formObj, isPreview } = useFormContext();
	// @ts-ignore saved_data is a property of formObj.
	const { saved_data = {} } = formObj;
	const [snapshot, setSnapshot] = useState(saved_data?.snapshot || '');

	const { allBlocks, answers, currentBlockId, getFieldAnswerVal, globalHash } = useSelect(
		(select) => {
			return {
				allBlocks: select('quillForms/renderer-core').getBlocksRecursively(),
				currentBlockId: select(
					'quillForms/renderer-core'
				).getCurrentBlockId(),
				answers: select('quillForms/renderer-core').getAnswers(),
				isReviewing: select('quillForms/renderer-core').isReviewing(),
				getFieldAnswerVal: select('quillForms/renderer-core')
					.getFieldAnswerVal,
				globalHash: select('quillForms/renderer-core').getGlobalHash(),
			};
		}
	);

	const {
		goToBlock,
		setFieldValidationErr,
		setIsFieldValid,
		setIsReviewing,
		setGlobalHash,
	} = useDispatch('quillForms/renderer-core');

	useEffect(() => {
		if (saved) {
			setIsDisabled(true);
			setTimeout(() => {
				setSaved(false);
			}, 2000);
		}
	}, [saved]);

	useEffect(() => {
		if (isPreview) {
			setIsDisabled(true);
		}
		else {
			setIsDisabled(false);
		}

	}, [answers]);


	const saveAndContinue = formObj?.saveandcontinue;
	const recipients = saveAndContinue?.recipients;

	if (!saveAndContinue?.enable || !recipients?.length) {
		return null;
	}

	const getEmailBlockId = () => {
		let emailBlockId = recipients[0];
		// Check if has text like {{field:blockId}} clear it and return blockId.
		if (!emailBlockId.includes('{{field:')) {
			return false;
		}
		emailBlockId = emailBlockId.replace('{{field:', '');
		emailBlockId = emailBlockId.replace('}}', '');

		return emailBlockId;
	};

	const saveHandler = async () => {
		if (isPreview || isSaving || isDisabled) return;
		// @ts-ignore, qfRender is a global variable.
		const qfRender = window.qfRender;
		const ajaxurl = qfRender.ajaxurl || '';
		const formId = qfRender.formId;

		const emailBlockId = getEmailBlockId();
		if (emailBlockId) {
			const emailValue = getFieldAnswerVal(emailBlockId);
			if (!emailValue) {
				setTimeout(() => {
					setIsFieldValid(emailBlockId, false);
					if (size(messages) && messages['label.errorAlert.required']) {
						setFieldValidationErr(emailBlockId, messages['label.errorAlert.required']);
					}
					setIsReviewing(true);
					const block = allBlocks.find((block) => block.id === emailBlockId);
					if (block) {
						if (block?.parentId) {
							goToBlock(block.parentId);
						}
						else {
							goToBlock(emailBlockId);
						}
					}
					goToBlock(emailBlockId);

				}, 100);


				return;
			}

			if (!emailValue?.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
				setTimeout(() => {
					setIsFieldValid(emailBlockId, false);
					if (size(messages) && messages['label.errorAlert.email']) {
						setFieldValidationErr(emailBlockId, messages['label.errorAlert.email']);
					}
					setIsReviewing(true);
					goToBlock(emailBlockId);

				}, 100);

				return;
			}
		}
		setIsSaving(true);

		try {
			let formData = {
				answers,
				currentBlockId,
				formId,
			};

			formData = applyFilters(
				'QuillForms.Renderer.SaveSubmissionFormData',
				formData,
				{ formObject: formObj }
			) as any;
			const data = new FormData();
			data.append('action', 'quillforms_form_save');
			data.append('formData', JSON.stringify(formData));
			data.append('quillforms_nonce', qfRender._nonce);
			if (snapshot) {
				data.append('snapshot', snapshot);
			}
			const response = await fetch(ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				body: data,
			});
			const responseData = await response.json();
			if (responseData.success) {
				setSaved(true);
				setSnapshot(responseData.data.snapshot);
			}
		} catch (error) {
			console.error(error);
		}

		setIsSaving(false);
	};

	const partialSubmission = async () => {
		if (isPreview || isSaving || isDisabled) return;
		// @ts-ignore, qfRender is a global variable.
		const qfRender = window.qfRender;
		const ajaxurl = qfRender.ajaxurl || '';
		const formId = qfRender.formId;
		setIsSaving(true);

		try {
			let formData = {
				answers,
				currentBlockId,
				formId,
			};

			formData = applyFilters(
				'QuillForms.Renderer.SaveSubmissionFormData',
				formData,
				{ formObject: formObj }
			) as any;
			const data = new FormData();
			data.append('action', 'quillforms_form_partial_submission');
			data.append('formData', JSON.stringify(formData));
			data.append('quillforms_nonce', qfRender._nonce);
			if (globalHash) {
				data.append('hash', globalHash);
			}
			const response = await fetch(ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				body: data,
			});
			const responseData = await response.json();
			if (responseData.success) {
				setSaved(true);
				setGlobalHash(responseData.data.hash);
			}
		} catch (error) {
			console.error(error);
		}

		setIsSaving(false);
	};

	return (
		<>
			<Button className={classnames("renderer-core-save-button", {
				disabled: isDisabled,
			})} disableIcon={true} onClick={partialSubmission}>

				{saveAndContinue?.buttonLabel ?? "Save"}
				{isSaving && (
					<Loader
						wrapperClass="renderer-core-save-btn__loader"
						color="#fff"
						height={20}
						width={20}
					/>
				)}
			</Button>
			<span className={classnames("renderer-core-form-saved", {
				"renderer-core-form-saved--show": saved,
			})}>{saveAndContinue?.successMessage ?? "Form successfully saved! Check Your Inbox"}</span>
		</>
	);
};

export default SaveBtn;
