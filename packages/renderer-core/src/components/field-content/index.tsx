/**
 * WordPress Depndencies
 */
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Depndencies
 */
import FieldHeader from '../field-header';
import BlockOutput from '../field-display-wrapper';

const FieldContent: React.FC = () => {
	const [ isShaking, setIsShaking ] = useState< boolean >( false );

	return (
		<div
			className={ classnames( 'renderer-components-field-content', {
				'is-shaking': isShaking,
			} ) }
		>
			<FieldHeader />
			<BlockOutput
				isShaking={ isShaking }
				setIsShaking={ ( val ) => {
					setIsShaking( val );
				} }
			/>
		</div>
	);
};

export default FieldContent;
