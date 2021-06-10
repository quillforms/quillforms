/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External Depdnencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { useMessages } from '../../hooks';
import { HTMLParser } from '..';

const DefaultThankYouScreen: React.FC = () => {
	const [ isActive, setIsActive ] = useState( false );
	const messages = useMessages();
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
			<HTMLParser
				value={ messages[ 'block.defaultThankYouScreen.label' ] }
			/>
		</div>
	);
};

export default DefaultThankYouScreen;
