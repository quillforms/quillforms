/**
 * External Dependencies
 */
import { useSlate } from 'slate-react';

/**
 * Internal Dependencies
 */
import Button from './button';

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
				className={
					'mark-wrapper' +
					( isFormatActive( editor, format ) ? ' active' : '' )
				}
			>
				{ children }
			</div>
		</Button>
	);
};
export default FormatButton;
