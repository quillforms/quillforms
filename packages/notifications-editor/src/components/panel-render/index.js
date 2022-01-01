/**
 * WordPress Dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import NotificationEditorWrapper from '../notification-editor-wrapper';
import NotificationsList from '../notifications-list';

let timer;
const PanelRender = () => {
	const [ activeSlide, setActiveSlide ] = useState( 0 );
	const [ isAnimating, setIsAnimating ] = useState( false );

	const ref = useRef();
	useEffect( () => {
		if ( ref?.current ) {
			setTimeout( () => {
				if ( ref?.current ) {
					ref.current.scrollTo( 0, 0 );
				}
			}, 0 );
		}
	}, [ activeSlide ] );

	useEffect( () => {
		if ( isAnimating ) {
			timer = setTimeout( () => {
				setIsAnimating( false );
			}, 600 );
		}
		return () => clearTimeout( timer );
	}, [ isAnimating, activeSlide ] );

	const [ currentNotificationId, setCurrentNotificationId ] = useState(
		null
	);

	const { currentNotificationProperties } = useSelect( ( select ) => {
		if ( currentNotificationId ) {
			return {
				currentNotificationProperties: select(
					'quillForms/notifications-editor'
				).getNotificationProperties( currentNotificationId ),
			};
		}
		return {
			currentNotificationProperties: {
				title: '',
				toType: 'email',
				active: true,
				recipients: [],
				replyTo: '',
				subject: '',
				message: '{{form:all_answers}}',
			},
		};
	} );

	return (
		<div
			className={ `notifications-editor-panel-render active-slide-${ activeSlide }` }
			ref={ ref }
		>
			<NotificationsList
				isAnimating={ isAnimating }
				isActive={ activeSlide === 0 }
				setCurrentNotificationId={ setCurrentNotificationId }
				goNext={ () => {
					setIsAnimating( true );
					setTimeout( () => {
						setActiveSlide( 1 );
					}, 50 );
				} }
			/>
			<NotificationEditorWrapper
				isAnimating={ isAnimating }
				isActive={ activeSlide === 1 }
				activeSlide={ activeSlide }
				notificationId={ currentNotificationId }
				currentNotificationProperties={ {
					...currentNotificationProperties,
				} }
				goBack={ () => {
					setIsAnimating( true );
					setTimeout( () => {
						setActiveSlide( 0 );
					}, 50 );
				} }
			/>
		</div>
	);
};

export default PanelRender;
