/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/builder-components';

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
	const {
		type,
		currentFormItem,
		toggleDescription,
		toggleRequired,
		setAttachment,
	} = props;

	const {
		editableSupport,
		requiredSupport,
		descriptionSupport,
		attachmentSupport,
	} = useSelect( ( select ) => {
		return {
			editableSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				type,
				'editable'
			),
			requiredSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				type,
				'required'
			),
			descriptionSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				type,
				'description'
			),
			attachmentSupport: select( 'quillForms/blocks' ).hasBlockSupport(
				type,
				'attachment'
			),
		};
	} );
	const { description, attachment } = currentFormItem;
	return (
		<Fragment>
			{ descriptionSupport && (
				<__experimentalBaseControl>
					<__experimentalControlWrapper>
						<__experimentalControlLabel label={ 'Description' } />
						<ToggleControl
							onChange={ toggleDescription }
							checked={ !! description }
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
									setAttachment( {
										type: 'image',
										url: media.url,
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
								onClick={ () => setAttachment( {} ) }
								color="secondary"
							>
								Remove
							</button>
						) }
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
			) }
			{ editableSupport && requiredSupport && (
				<__experimentalBaseControl>
					<__experimentalControlWrapper>
						<__experimentalControlLabel label={ 'Required' } />
						<ToggleControl
							checked={ currentFormItem.required }
							onChange={ toggleRequired }
						/>
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
			) }
		</Fragment>
	);
};
export default DefaultControls;
