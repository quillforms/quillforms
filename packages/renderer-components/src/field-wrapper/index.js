/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render/context';
import FieldContent from '../field-content';

const FieldWrapper = ( {
	isFocused,
	animation,
	setCanGoNext,
	setCanGoPrev,
	next,
} ) => {
	const ref = useRef();
	const { field, isActive } = useFieldRenderContext();
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
		setCanGoNext( true );
		setCanGoPrev( true );
	}, [ isActive ] );

	return (
		<div
			{ ...handlers }
			tabIndex={ 0 }
			className={ classnames(
				'renderer-components-field-wrapper',
				{
					active: isActive,
				},
				animation ? animation : ''
			) }
			onScroll={ ( e ) => {
				e.preventDefault();
				if ( ref.current.scrollTop === 0 ) {
					timer = setTimeout( () => {
						setCanGoPrev( true );
					}, 500 );
				} else {
					setCanGoPrev( false );
				}
				if (
					ref.current.scrollHeight - ref.current.clientHeight ===
					ref.current.scrollTop
				) {
					timer = setTimeout( () => {
						setCanGoNext( true );
					}, 500 );
				} else {
					setCanGoNext( false );
				}
			} }
		>
			<section id={ 'block-' + field.id }>
				<div
					className="renderer-components-field-wrapper__content-wrapper"
					ref={ ref }
				>
					<FieldContent isFocused={ isFocused } next={ next } />
				</div>
			</section>
		</div>
	);
};
export default FieldWrapper;
