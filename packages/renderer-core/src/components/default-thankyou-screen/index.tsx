/**
 * External Depdnencies
 */
import classnames from 'classnames';
import { useEffect, useState } from '@wordpress/element';

const DefaultThankYouScreen: React.FC = () => {
	const [ isActive, setIsActive ] = useState( false );
	useEffect( () => {
		setIsActive( true );
	}, [] );
	return (
		<div
			className={ classnames(
				'renderer-components-default-thankyou-screen',
				{
					active: isActive,
				}
			) }
		>
			Thanks for filling this in
		</div>
	);
};

export default DefaultThankYouScreen;
