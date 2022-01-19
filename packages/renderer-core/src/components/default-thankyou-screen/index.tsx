/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External Depdnencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { useBlockTheme, useMessages } from '../../hooks';
import { HTMLParser } from '..';

const DefaultThankYouScreen: React.FC = () => {
	const theme = useBlockTheme( undefined );
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
				},
				css`
					color: ${ theme.questionsColor };
				`
			) }
		>
			<HTMLParser
				value={ messages[ 'block.defaultThankYouScreen.label' ] }
			/>
		</div>
	);
};

export default DefaultThankYouScreen;
