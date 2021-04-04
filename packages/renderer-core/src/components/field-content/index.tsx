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
import QuestionHeader from '../field-header';
import BlockOutput from '../block-output';

const FieldContent: React.FC = () => {
	const [ isShaking, setIsShaking ] = useState< boolean >( false );

	return (
		<div
			className={ classnames( 'renderer-components-field-content', {
				'is-shaking': isShaking,
			} ) }
		>
			<QuestionHeader />
			<BlockOutput
				isShaking={ isShaking }
				setIsShaking={ setIsShaking }
			/>
		</div>
	);
};

export default FieldContent;
