import { ToolbarButton, Disabled, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import TextareaAutosize from 'react-autosize-textarea';
import { css } from 'emotion';

const CustomHTML = ( { value, onChange } ) => {
	return (
		<>
			<div
				className={ css`
					textarea {
						min-height: 100px;
						width: 100%;
						margin-top: 10px;
					}
				` }
			>
				<TextareaAutosize
					value={ value }
					// @ts-expect-error
					onChange={ ( e ) => onChange( e.target?.value ) }
					placeholder={ __( 'Write HTML…' ) }
					aria-label={ __( 'HTML' ) }
				/>
			</div>
		</>
	);
};

export default CustomHTML;
