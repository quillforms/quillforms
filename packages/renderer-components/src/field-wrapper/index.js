/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { useSwipeable } from 'react-swipeable';

/**
 * Internal Dependencies
 */
import QuestionHeader from '../question-header';
import BlockFooter from '../block-footer';
import BlockOutput from '../block-output';

const FieldWrapper = ( {
	id,
	isActive,
	isReviewing,
	animation,
	attributes,
	setCanSwipeNext,
	setCanSwipePrev,
	block,
	title,
	description,
	attachment,
	isAttachmentSupported,
	counter,
	next,
} ) => {
	const ref = useRef();
	let timer = null;

	const handlers = useSwipeable( {
		onSwiped: () => {
			// // console.log("onSwiped");
		},
		onSwipedUp: () => {
			// // console.log("onSwipeUp");
		},
		onSwiping: () => {
			// // console.log("onSwiping");
		},
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	} );

	useEffect( () => {
		if ( isActive ) {
			if ( ref && ref.current ) {
				setTimeout( () => {
					ref.current.scrollTo( 0, 0 );
				}, 0 );
			}
		} else {
			clearTimeout( timer );
		}
		setCanSwipeNext( true );
		setCanSwipePrev( true );
	}, [ isActive ] );

	return (
		<div
			{ ...handlers }
			tabIndex={ 0 }
			className={
				'renderer-components-field-wrapper' +
				( isActive ? ' active ' : ' ' ) +
				( animation ? animation : '' )
			}
			onScroll={ ( e ) => {
				e.preventDefault();
				if ( ref.current.scrollTop === 0 ) {
					timer = setTimeout( () => {
						setCanSwipePrev( true );
					}, 500 );
				} else {
					setCanSwipePrev( false );
				}
				if (
					ref.current.scrollHeight - ref.current.clientHeight ===
					ref.current.scrollTop
				) {
					timer = setTimeout( () => {
						setCanSwipeNext( true );
					}, 500 );
				} else {
					setCanSwipeNext( false );
				}
			} }
		>
			<section id={ 'block-' + id }>
				<div
					className="renderer-components-field-wrapper__content-wrapper"
					ref={ ref }
				>
					<div className="renderer-components-field-wrapper__content">
						<QuestionHeader
							attributes={ attributes }
							title={ title }
							displayOnly={ block.supports.displayOnly }
							counter={ counter }
							description={ description }
							attachment={ attachment }
							isAttachmentSupported={ isAttachmentSupported }
						/>
						<BlockOutput />
						<BlockFooter
							displayOnly={ block.supports.displayOnly }
							id={ id }
							isReviewing={ isReviewing }
							next={ next }
						/>
					</div>
				</div>
			</section>
		</div>
	);
};
export default FieldWrapper;
