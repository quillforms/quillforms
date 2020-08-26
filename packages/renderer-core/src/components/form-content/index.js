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

let lastScrollDate = 0;
const lethargy = new Lethargy();
const FormContent = ( { formStructure, editableFields, blocks } ) => {
	const { fields } = formStructure;
	const {
		currentBlockCat,
		currentBlockId,
		isBlockChanging,
		animationEffects,
	} = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			currentBlockCat: select(
				'quillForms/renderer-core'
			).getCurrentBlockCat(),
			isBlockChanging: select(
				'quillForms/renderer-core'
			).isBlockChanging(),
		};
	} );

	const { setAnimationEffects } = useDispatch( 'quillForms/renderer-core' );
	const [ isFocused, setIsFocused ] = useState( false );

	const ref = useRef();

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
	}, cur );

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
	const getPrevField = () => {
		let $animationState = { ...animationState };
		if ( currentFieldIndex > 0 || submissionScreenActive ) {
			$animationState = {
				...$animationState,
				currentBlockId: fields[ currentFieldIndex - 1 ].id,
				isBlockChanging: true,
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
	};

	// Swtich To Fields Category
	const switchToFieldsCat = useCallback( () => {
		setAnimationState( {
			currentBlockCat: 'fields',
			currentBlockId: fields[ 0 ].id,
			currentFieldIndex: 0,
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
			! isLastField
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
							const block = blocks[ 'welcome-screen' ];
							return (
								<block.rendererConfig.output
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
								let blockCounter = null;
								blockCounter = editableFields.findIndex(
									( editableField ) =>
										field.id === editableField.id
								);
								return (
									<FieldWrapper
										animation={ findKey(
											animationEffects,
											( effectVal ) =>
												effectVal === field.id
										) }
										counter={
											blockCounter || blockCounter === 0
												? blockCounter + 1
												: null
										}
										key={ field.id }
										isActive={ currentBlockId === field.id }
										id={ field.id }
										isAttachmentSupported={
											field.isAttachmentSupported
										}
										attachment={ field.attachment }
										setCanSwipeNext={ setCanSwipeNext }
										setCanSwipePrev={ setCanSwipePrev }
										title={ field.title }
										attributes={ field.attributes }
										description={ field.description }
										next={ () => getNextField() }
									/>
								);
							} ) }
							<div className="screen__footer">
								{ editableFields.length > 0 && (
									<ProgressBar
										currentBlockId={ currentBlockId }
										totalQuestions={ editableFields.length }
									/>
								) }
							</div>
						</FieldsWrapper>
					) }

					{ formStructure.thankyouScreens &&
						formStructure.thankyouScreens.length > 0 &&
						formStructure.thankyouScreens.map( ( screen ) => {
							const block = blocks[ 'thankyou-screen' ];
							return (
								<block.rendererConfig.output
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
