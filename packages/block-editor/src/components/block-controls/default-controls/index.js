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
import { Fragment } from '@wordpress/element';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import isEmpty from 'lodash/isEmpty';

const DefaultControls = ( props ) => {
	const {
		supports,
		currentFormItem,
		toggleDescription,
		toggleRequired,
		setAttachment,
	} = props;

	const { description, attachment } = currentFormItem;
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label={ 'Description' } />
					<ToggleControl
						onChange={ toggleDescription }
						checked={ !! description }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			{ supports.attachment && (
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
			{ ! supports.displayOnly && (
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
