/**
 * WordPress Dependencies
 */
import {
	Fragment,
	useState,
	useEffect,
	useRef,
	useCallback,
} from '@wordpress/element';

import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { Lethargy } from 'lethargy';
import findKey from 'lodash/findKey';

/**
 * Internal Dependencies
 */
import { FieldWrapper, ProgressBar } from '@quillforms/renderer-components';
import FieldsWrapper from '../fields-wrapper';
import SubmissionScreen from '../submission-screen';

let lastScrollDate = 0;
const lethargy = new Lethargy();
const FormContent = ( { formStructure, editableFields, blocks } ) => {
	const { fields } = formStructure;
	// console.log(fields);
	const [ animationState, setAnimationState ] = useState( {
		isAnimating: false,
		currentBlockId: null,
		currentBlockCat: null,
		currentFieldIndex: null,
		submissionScreenActive: false,
		moveUp: null,
		moveDown: null,
		moveDownFromUp: null,
		moveUpFromDown: null,
	} );
	// // console.log(animationState);
	const {
		currentFieldIndex,
		submissionScreenActive,
		currentBlockCat,
		currentBlockId,
	} = animationState;
	const [ canSwipeNext, setCanSwipeNext ] = useState( true );
	const [ canSwipePrev, setCanSwipePrev ] = useState( true );
	const [ isReviewing, setIsReviewing ] = useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ isFocused, setIsFocused ] = useState( false );

	const ref = useRef();

	const { setIsFieldValid, setIsFieldAnswered, setFieldAnswer } = useDispatch(
		'quillForms/render/answers'
	);

	const { answers } = useSelect( ( select ) => {
		return {
			answers: select( 'quillForms/render/answers' ).getAnswers(),
		};
	} );

	const handleClickOutside = ( e ) => {
		if ( ref.current && ! ref.current.contains( e.target ) ) {
			setIsFocused( false );
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect( () => {
		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	} );

	useEffect( () => {
		let $animationState = { ...animationState };
		$animationState = {
			...$animationState,
			currentBlockCat: formStructure.currentBlockCat,
			currentBlockId: formStructure.currentBlockId,
			submissionScreenActive: false,
		};
		if ( formStructure.currentBlockCat === 'fields' ) {
			if ( currentBlockId !== formStructure.currentBlockId ) {
				$animationState.currentFieldIndex = fields.findIndex(
					( field ) => formStructure.currentBlockId === field.id
				);
				$animationState = {
					...$animationState,
					moveUp: null,
					moveUpFromDown: formStructure.currentBlockId,
					moveDown: null,
					moveDownFromUp: null,
				};
			}
		} else {
			$animationState.currentFieldIndex = null;
		}

		setAnimationState( $animationState );
	}, [ JSON.stringify( formStructure ) ] );

	useEffect( () => {
		const $animationState = animationState;
		if ( $animationState.isAnimating ) {
			const timer = setTimeout( () => {
				// // console.log($animationState);
				setAnimationState( {
					...$animationState,
					isAnimating: false,
				} );
			}, 500 );
			return () => clearTimeout( timer );
		}
	}, [ animationState.isAnimating ] );

	// Get Next Field
	const getNextField = useCallback( () => {
		let $animationState = { ...animationState };
		const isLastField = currentFieldIndex === fields.length - 1;
		if ( isLastField ) {
			$animationState.currentBlockId = '';
			$animationState.currentFieldIndex = null;
			$animationState.submissionScreenActive = true;
		} else {
			$animationState.currentFieldIndex = currentFieldIndex + 1;
			$animationState.currentBlockId = fields[ currentFieldIndex + 1 ].id;
		}
		$animationState.isAnimating = true;
		$animationState = {
			...$animationState,
			moveUp: fields[ currentFieldIndex ].id,
			moveUpFromDown: isLastField
				? null
				: fields[ currentFieldIndex + 1 ].id,
			moveDown: null,
			moveDownFromUp: null,
		};
		setAnimationState( $animationState );
	} );

	// Submit Handler
	const submitHandler = () => {};

	// Review Handler
	const reviewHandler = () => {
		// // console.log("review handled");
	};

	// Get Previous Field
	const getPrevField = useCallback( () => {
		let $animationState = { ...animationState };
		if ( currentFieldIndex > 0 || submissionScreenActive ) {
			$animationState = {
				...$animationState,
				currentBlockId: submissionScreenActive
					? fields[ fields.length - 1 ].id
					: fields[ currentFieldIndex - 1 ].id,
				submissionScreenActive: false,
				isAnimating: true,
				currentFieldIndex: submissionScreenActive
					? fields.length - 1
					: currentFieldIndex - 1,
				moveUp: null,
				moveUpFromDown: null,
				moveDown: submissionScreenActive
					? null
					: fields[ currentFieldIndex ].id,
				moveDownFromUp: submissionScreenActive
					? fields[ fields.length - 1 ].id
					: fields[ currentFieldIndex - 1 ].id,
			};
			setAnimationState( $animationState );
		}
	} );

	// Swtich To Fields Category
	const switchToFieldsCat = useCallback( () => {
		setAnimationState( {
			currentBlockCat: 'fields',
			currentBlockId: fields[ 0 ].id,
			currentFieldIndex: 0,
			submissionScreenActive: false,
			isAnimating: true,
			moveUp: null,
			moveDown: null,
			moveUpFromDown: fields[ 0 ].id,
			moveDownFromUp: null,
		} );
	} );

	// Mouse Wheel Handler
	const scrollHandler = useCallback( ( e ) => {
		e.stopPropagation();
		// // console.log(canSwipeNext);
		if ( animationState.isAnimating ) return;
		const lethargyCheck = lethargy.check( e );
		const now = new Date().getTime();
		if (
			lethargyCheck === false ||
			animationState.isAnimating ||
			( lastScrollDate && now - lastScrollDate < 700 )
		)
			return;
		if ( canSwipePrev && lethargyCheck === 1 && e.deltaY < -50 ) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			getPrevField();
		} else if (
			canSwipeNext &&
			lethargyCheck === -1 &&
			e.deltaY > 50 &&
			animationState.submissionScreenActive !== true
		) {
			lastScrollDate = new Date().getTime();
			// Scroll down
			getNextField();
		}
	} );
	const getFieldsToRender = useCallback( () => {
		let fieldsToRender = [];
		const fieldsLength = fields.length;

		if ( currentBlockCat === 'fields' ) {
			if ( ! submissionScreenActive ) {
				if ( fields[ currentFieldIndex - 1 ] )
					fieldsToRender.push( fields[ currentFieldIndex - 1 ] );
				if ( fields[ currentFieldIndex ] )
					fieldsToRender.push( fields[ currentFieldIndex ] );
				if ( fields[ currentFieldIndex + 1 ] )
					fieldsToRender.push( fields[ currentFieldIndex + 1 ] );
			} else {
				fieldsToRender = [ fields[ fieldsLength - 1 ] ];
			}
		}
		return fieldsToRender;
	}, [
		animationState.currentBlockId,
		animationState.submissionScreenActive,
	] );

	const fieldsToRender = getFieldsToRender();
	// // console.log(fieldsToRender);
	const animationEffects = {
		moveUp: animationState.moveUp,
		moveDownFromUp: animationState.moveDownFromUp,
		moveDown: animationState.moveDown,
		moveUpFromDown: animationState.moveUpFromDown,
	};
	return (
		<div
			ref={ ref }
			onFocus={ () => setIsFocused( true ) }
			className="renderer-core-form-content"
		>
			{ formStructure && (
				<Fragment>
					{ formStructure.welcomeScreens &&
						formStructure.welcomeScreens.length > 0 &&
						formStructure.welcomeScreens.map( ( screen ) => {
							const block = blocks.find(
								( b ) => b.type === 'welcome_screen'
							);
							return (
								<block.output
									next={ switchToFieldsCat }
									isActive={ currentBlockId === screen.id }
									key={ screen.id }
									id={ screen.id }
									title={ screen.title }
									addDescription={ screen.addDescription }
									description={ screen.description }
									attributes={ screen.attributes }
									attachment={ screen.attachment }
								/>
							);
						} ) }
					{ fieldsToRender && fieldsToRender.length > 0 && (
						<FieldsWrapper
							isActive={ currentBlockCat === 'fields' }
							scrollHandler={ scrollHandler }
						>
							{ fieldsToRender.map( ( field ) => {
								const block = blocks.find(
									( b ) => b.type === field.type
								);
								const fieldAnswer = answers.find(
									( answer ) => answer.id === field.id
								);
								let blockCounter = null;
								let editableFieldProps = {};
								if ( field.displayOnly !== true ) {
									blockCounter = editableFields.findIndex(
										( editableField ) =>
											field.id === editableField.id
									);
									editableFieldProps = {
										counter: blockCounter + 1,
										required: field.required,
										isReviewing,
										isValid: fieldAnswer.isValid,
										val: fieldAnswer.value,
										setIsValid: ( val ) =>
											setIsFieldValid( field.id, val ),
										setIsAnswered: ( val ) =>
											setIsFieldAnswered( field.id, val ),
										setVal: ( val ) =>
											setFieldAnswer( field.id, val ),
									};
								}
								return (
									<FieldWrapper
										animation={ findKey(
											animationEffects,
											( effectVal ) =>
												effectVal === field.id
										) }
										key={ field.id }
										isActive={ currentBlockId === field.id }
										id={ field.id }
										next={ () => getNextField() }
										setCanSwipeNext={ setCanSwipeNext }
										setCanSwipePrev={ setCanSwipePrev }
									>
										<block.output
											isAnimating={
												animationState.isAnimating
											}
											isActive={
												currentBlockId === field.id
											}
											isFocused={ isFocused }
											addDescription={
												field.addDescription
											}
											isAttachmentSupported={
												field.isAttachmentSupported
											}
											attachment={ field.attachment }
											description={ field.description }
											id={ field.id }
											title={ field.title }
											attributes={ field.attributes }
											next={ () => {
												if (
													field.displayOnly ||
													fieldAnswer.isValid
												) {
													getNextField();
												}
											} }
											{ ...editableFieldProps }
										/>
									</FieldWrapper>
								);
							} ) }
							<SubmissionScreen
								submitHandler={ submitHandler }
								isSubmitting={ isSubmitting }
								setIsSubmitting={ setIsSubmitting }
								reviewHandler={ reviewHandler }
								isReviewing={ isReviewing }
								invalidFields={ answers.filter(
									( answer ) => answer.isValid !== true
								) }
								setIsReviewing={ setIsReviewing }
								active={ submissionScreenActive === true }
							/>
							<div className="screen__footer">
								{ editableFields.length > 0 && (
									<ProgressBar
										currentBlockId={ currentBlockId }
										totalQuestions={ editableFields.length }
										answered={
											answers.filter(
												( answer ) =>
													answer.isAnswered === true
											).length
										}
									/>
								) }
							</div>
						</FieldsWrapper>
					) }

					{ formStructure.thankyouScreens &&
						formStructure.thankyouScreens.length > 0 &&
						formStructure.thankyouScreens.map( ( screen ) => {
							const block = blocks.find(
								( b ) => b.type === 'thankyou_screen'
							);
							return (
								<block.output
									reload={ switchToFieldsCat }
									isActive={ currentBlockId === screen.id }
									key={ screen.id }
									id={ screen.id }
									title={ screen.title }
									addDescription={ screen.addDescription }
									description={ screen.description }
									attributes={ screen.attributes }
									attachment={ screen.attachment }
								/>
							);
						} ) }
				</Fragment>
			) }
		</div>
	);
};
export default FormContent;
