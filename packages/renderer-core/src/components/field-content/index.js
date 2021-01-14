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
import QuestionHeader from '../question-header';
import BlockOutput from '../block-output';

const FieldContent = ( { next, isFocused } ) => {
	const [ isShaking, setIsShaking ] = useState( false );

	return (
		<div
			className={ classnames( 'renderer-components-field-content', {
				'is-shaking': isShaking,
			} ) }
		>
			<QuestionHeader />
			<BlockOutput
				next={ next }
				isFocused={ isFocused }
				setIsShaking={ setIsShaking }
			/>
		</div>
	);
};

export default FieldContent;
