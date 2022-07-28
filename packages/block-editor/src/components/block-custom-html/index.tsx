import { ToolbarButton, Disabled, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import TextareaAutosize from 'react-autosize-textarea';

import Preview from './preview';
const CustomHTML = ( { value, onChange } ) => {
	const [ isPreview, setIsPreview ] = useState( false );
	const isDisabled = useContext( Disabled.Context );

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML() {
		setIsPreview( false );
	}

	return (
		<>
			<ToolbarGroup>
				<ToolbarButton
					className="components-tab-button"
					isPressed={ ! isPreview }
					onClick={ switchToHTML }
				>
					HTML
				</ToolbarButton>
				<ToolbarButton
					className="components-tab-button"
					isPressed={ isPreview }
					onClick={ switchToPreview }
				>
					{ __( 'Preview' ) }
				</ToolbarButton>
			</ToolbarGroup>
			{ isPreview || isDisabled ? (
				<Preview content={ value } isSelected={ true } />
			) : (
				<TextareaAutosize
					value={ value }
					// @ts-expect-error
					onChange={ ( e ) => onChange( e.target?.value ) }
					placeholder={ __( 'Write HTML…' ) }
					aria-label={ __( 'HTML' ) }
				/>
			) }
		</>
	);
};

export default CustomHTML;
