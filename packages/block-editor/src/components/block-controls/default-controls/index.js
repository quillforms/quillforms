/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/admin-components';

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

const DefaultControls = ( props ) => {
	const { blockName, attributes, setAttributes } = props;

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
	const { required, attachment } = attributes;
	return (
		<Fragment>
			{ editableSupport && requiredSupport && (
				<__experimentalBaseControl>
					<__experimentalControlWrapper>
						<__experimentalControlLabel label={ 'Required' } />
						<ToggleControl
							checked={ required }
							onChange={ () =>
								setAttributes( {
									required: ! required,
								} )
							}
						/>
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
			) }
			{ attachmentSupport && (
				<__experimentalBaseControl>
					<__experimentalControlWrapper>
						<__experimentalControlLabel label={ 'Image' } />
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
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
			) }
		</Fragment>
	);
};
export default DefaultControls;
