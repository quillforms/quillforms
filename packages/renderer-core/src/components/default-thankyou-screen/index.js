/**
 * External Depdnencies
 */
import classnames from 'classnames';

const DefaultThankYouScreen = ( { isActive } ) => {
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
