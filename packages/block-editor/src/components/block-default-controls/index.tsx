/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';
import type { BlockAttributes } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
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
	const { editableSupport, requiredSupport, attachmentSupport } = useSelect(
		( select ) => {
			return {
				editableSupport: select( 'quillForms/blocks' ).hasBlockSupport(
					blockName,
					'editable'
				),
				requiredSupport: select( 'quillForms/blocks' ).hasBlockSupport(
					blockName,
					'required'
				),
				attachmentSupport: select(
					'quillForms/blocks'
				).hasBlockSupport( blockName, 'attachment' ),
			};
		}
	);
	let required, attachment;
	if ( attributes ) {
		required = attributes.required;
		attachment = attributes.attachment;
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
		</Fragment>
	);
};
export default DefaultControls;
