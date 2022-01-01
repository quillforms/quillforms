/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	BaseControl,
	ControlWrapper,
	ControlLabel,
	Button,
} from '@quillforms/admin-components';
import type { BlockAttributes } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from 'react';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { isEmpty } from 'lodash';

interface Props {
	blockName: string;
	attributes?: BlockAttributes;
	setAttributes: ( x: Record< string, unknown > ) => void;
}
const DefaultControls: React.FC< Props > = ( {
	blockName,
	attributes,
	setAttributes,
} ) => {
	const {
		editableSupport,
		requiredSupport,
		attachmentSupport,
		themesList,
	} = useSelect( ( select ) => {
		return {
			editableSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'editable'
			),
			requiredSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'required'
			),
			attachmentSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'attachment'
			),
			themesList: select( 'quillForms/theme-editor' ).getThemesList(),
		};
	} );
	let required, attachment;
	if ( attributes ) {
		required = attributes.required;
		attachment = attributes.attachment;
		// theme = attributes.theme;
	}
	return (
		<Fragment>
			{ editableSupport && requiredSupport && (
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={ 'Required' } />
						<ToggleControl
							checked={ required }
							onChange={ () =>
								setAttributes( {
									required: ! required,
								} )
							}
						/>
					</ControlWrapper>
				</BaseControl>
			) }
			{ attachmentSupport && (
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={ 'Image' } />
						{ isEmpty( attachment ) ? (
							<MediaUpload
								onSelect={ ( media ) =>
									setAttributes( {
										attachment: {
											type: 'image',
											url: media.url,
										},
									} )
								}
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<button
										className="media-upload-btn"
										onClick={ open }
									>
										Add
									</button>
								) }
							/>
						) : (
							<button
								className="remove-media-btn"
								onClick={ () =>
									setAttributes( {
										attachment: {},
									} )
								}
								color="secondary"
							>
								Remove
							</button>
						) }
					</ControlWrapper>
				</BaseControl>
			) }
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<ControlLabel
						label={ 'Override theme for this block' }
					></ControlLabel>
					{ themesList?.length === 0 && (
						<Button isSecondary isButton isDefault>
							Create a theme first!
						</Button>
					) }
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default DefaultControls;
