/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';

/**
 * External Dependencis
 */
import { useSwipeable } from 'react-swipeable';

const FieldWrapper = ( {
	children,
	id,
	isActive,
	animation,
	setCanSwipeNext,
	setCanSwipePrev,
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
						{ children }
					</div>
				</div>
			</section>
		</div>
	);
};
export default FieldWrapper;
