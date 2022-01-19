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

// @ts-expect-error
import { ThemeCard, ThemeListItem } from '@quillforms/theme-editor';
import type { BlockAttributes } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { css } from 'emotion';

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
	const [ showThemeModal, setShowThemeModal ] = useState( false );
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
	let required, attachment, blockTheme;
	if ( attributes ) {
		required = attributes.required;
		attachment = attributes.attachment;
		blockTheme = attributes.themeId;
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
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={ 'Override theme' }></ControlLabel>
					{ themesList?.length === 0 ? (
						<Button
							isSecondary
							isButton
							isDefault
							onClick={ () => {} }
						>
							Create a theme first!
						</Button>
					) : (
						<Button
							isPrimary
							isButton
							isDefault
							onClick={ () => {
								setShowThemeModal( true );
							} }
						>
							Select a theme
						</Button>
					) }
				</ControlWrapper>
			</BaseControl>
			{ showThemeModal && (
				<Modal
					className={ classnames(
						'builder-core-drag-alert-modal',
						css`
							border: none !important;
							min-width: 420px !important;
							max-width: 470px !important;
							border-radius: 10px;
							z-index: 1111111;
						`
					) }
					// Because focus on editor is causing the click handler to be triggered
					shouldCloseOnClickOutside={ false }
					title="Select a theme!"
					onRequestClose={ () => {
						setShowThemeModal( false );
					} }
				>
					{ themesList.map( ( theme, index ) => {
						return (
							<ThemeCard
								index={ index }
								key={ theme.id }
								isSelected={ theme.id === blockTheme }
							>
								<ThemeListItem
									theme={ theme }
									onClick={ () => {
										setAttributes( {
											themeId: theme.id,
										} );
									} }
								/>
							</ThemeCard>
						);
					} ) }
				</Modal>
			) }
		</Fragment>
	);
};
export default DefaultControls;
