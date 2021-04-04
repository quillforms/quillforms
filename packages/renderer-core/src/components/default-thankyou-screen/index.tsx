/**
 * External Depdnencies
 */
import classnames from 'classnames';

interface Props {
	isActive: boolean;
}
const DefaultThankYouScreen: React.FC< Props > = ( { isActive } ) => {
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
