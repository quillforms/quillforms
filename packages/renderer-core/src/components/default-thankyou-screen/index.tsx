/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External Depdnencies
 */
import classnames from 'classnames';
import { css } from '@emotion/css';

/**
 * Internal Dependencies
 */
import { useMessages, useTheme } from '../../hooks';
import { HTMLParser } from '..';

const DefaultThankYouScreen: React.FC = () => {
	const theme = useTheme();
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
