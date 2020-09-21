/**
 * WordPress Dependencies
 */
import { useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import Slider from 'react-slick';

/**
 * Internal Dependencies
 */
import NotificationEditorWrapper from '../notification-editor-wrapper';
import NotificationsList from '../notifications-list';

const PanelRender = () => {
	const [ activeSlide, setActiveSlide ] = useState( 0 );
	const sliderRef = useRef();

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
				active: true,
				recipients: [],
				reply_to: '',
				subject: '',
				message: '<p>{{form:all_answers}}</p>',
			},
		};
	} );
	const sliderSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		arrows: false,
		draggable: false,
		swipe: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		touchMove: false,
		accessibility: false,
		adaptiveHeight: true,
	};

	return (
		<div className="notifications-editor-panel-render">
			<Slider
				{ ...sliderSettings }
				ref={ sliderRef }
				beforeChange={ ( oldIndex, newIndex ) => {
					setActiveSlide( newIndex );
				} }
			>
				<NotificationsList
					setCurrentNotificationId={ setCurrentNotificationId }
					sliderRef={ sliderRef }
				/>
				<NotificationEditorWrapper
					activeSlide={ activeSlide }
					notificationId={ currentNotificationId }
					currentNotificationProperties={ {
						...currentNotificationProperties,
					} }
					sliderRef={ sliderRef }
				/>
			</Slider>
		</div>
	);
};

export default PanelRender;
