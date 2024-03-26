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
import { useFormContext } from '../../hooks';

const SaveBtn: React.FC = () => {
	// @ts-ignore, qfRender is a global variable.
	const qfRender = window.qfRender;
	const [ isSaving, setIsSaving ] = useState( false );
	const [ saved, setSaved ] = useState( false );
	const { formObj } = useFormContext();
	// @ts-ignore saved_data is a property of formObj.
	const { saved_data = {} } = formObj;
	const [ snapshot, setSnapshot ] = useState( saved_data?.snapshot || '' );

	const { answers, currentBlockId, getFieldAnswerVal } = useSelect(
		( select ) => {
			return {
				currentBlockId: select(
					'quillForms/renderer-core'
				).getCurrentBlockId(),
				answers: select( 'quillForms/renderer-core' ).getAnswers(),
				isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
				getFieldAnswerVal: select( 'quillForms/renderer-core' )
					.getFieldAnswerVal,
			};
		}
	);

	const {
		goToBlock,
		setFieldValidationErr,
		setIsFieldValid,
		setIsReviewing,
	} = useDispatch( 'quillForms/renderer-core' );

	useEffect( () => {
		if ( saved ) {
			setTimeout( () => {
				setSaved( false );
			}, 2000 );
		}
	}, [ saved ] );

	if ( ! qfRender ) {
		return null;
	}

	const ajaxurl = qfRender.ajaxurl || '';
	const formId = qfRender.formId;
	const formObject = qfRender.formObject;
	const saveAndContinue = formObject?.saveandcontinue;
	const recipients = saveAndContinue?.recipients;

	if ( ! saveAndContinue?.enable || ! recipients?.length ) {
		return null;
	}

	const getEmailBlockId = () => {
		let emailBlockId = recipients[ 0 ];
		// Check if has text like {{field:blockId}} clear it and return blockId.
		if ( ! emailBlockId.includes( '{{field:' ) ) {
			return false;
		}
		emailBlockId = emailBlockId.replace( '{{field:', '' );
		emailBlockId = emailBlockId.replace( '}}', '' );

		return emailBlockId;
	};

	const saveHandler = async () => {
		const emailBlockId = getEmailBlockId();
		if ( emailBlockId ) {
			const emailValue = getFieldAnswerVal( emailBlockId );
			if ( ! emailValue ) {
				goToBlock( emailBlockId );
				setIsReviewing( true );
				setTimeout( () => {
					setIsFieldValid( emailBlockId, false );
					setFieldValidationErr( emailBlockId, 'Error' );
				}, 100 );

				return;
			}
		}
		setIsSaving( true );

		try {
			let formData = {
				answers,
				currentBlockId,
				formId,
			};

			formData = applyFilters(
				'QuillForms.Renderer.SaveSubmissionFormData',
				formData,
				{ formObject }
			) as any;
			const data = new FormData();
			data.append( 'action', 'quillforms_form_save' );
			data.append( 'formData', JSON.stringify( formData ) );
			data.append( 'quillforms_nonce', qfRender._nonce );
			if ( snapshot ) {
				data.append( 'snapshot', snapshot );
			}
			const response = await fetch( ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				body: data,
			} );
			const responseData = await response.json();
			if ( responseData.success ) {
				setSaved( true );
				setSnapshot( responseData.data.snapshot );
			}
		} catch ( error ) {
			console.error( error );
		}

		setIsSaving( false );
	};

	return (
		<Button disableIcon={ true } onClick={ saveHandler }>
			{ isSaving && (
				<Loader
					wrapperClass="renderer-core-submit-btn__loader"
					color="#fff"
					height={ 20 }
					width={ 20 }
				/>
			) }
			{ ! isSaving && saved && 'Saved !' }
			{ ! isSaving && ! saved && 'Save' }
		</Button>
	);
};

export default SaveBtn;
