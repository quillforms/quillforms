/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
/**
 * External Dependencies
 */
import Slider from 'react-slick';

/**
 * Internal Dependencies
 */
import NotificationEdit from '../notification-edit';
import NotificationsList from '../notifications-list';

const PanelRender = () => {
	const sliderRef = useRef();

	const sliderSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		arrows: false,
		draggable: false,
		swipe: false,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<div className="notifications-editor-panel-render">
			<Slider { ...sliderSettings } ref={ sliderRef }>
				<NotificationsList sliderRef={ sliderRef } />
				<NotificationEdit sliderRef={ sliderRef } />
			</Slider>
		</div>
	);
};

export default PanelRender;
