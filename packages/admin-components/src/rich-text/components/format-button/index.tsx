/**
 * External Dependencies
 */
import { useSlate } from 'slate-react';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import Button from '../button';

const FormatButton = ( { format, toggleFormat, isFormatActive, children } ) => {
	const editor = useSlate();
	return (
		<Button
			active={ isFormatActive( format ) }
			onMouseDown={ ( event ) => {
				event.preventDefault();
				toggleFormat( format );
			} }
		>
			<div
				className={ classnames( 'rich-text-mark-wrapper', {
					active: isFormatActive( editor, format ),
				} ) }
			>
				{ children }
			</div>
		</Button>
	);
};
export default FormatButton;
