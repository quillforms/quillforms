/**
 * QuillForms Dependencies
 */
import {
	allowedFormats as allowedFormatsType,
	MergeTags,
	RichTextControl,
} from '../../rich-text';
import Button from '../../button';

/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { useComboboxControlContext } from '../context';

interface Props {
	allowedFormats?: allowedFormatsType;
}

const RichText: React.FC< Props > = ( { allowedFormats } ) => {
	const { id, options, value, onChange, isToggleEnabled, placeholder } =
		useComboboxControlContext();

	const tags: MergeTags = [];
	for ( const option of options ) {
		if ( option.isMergeTag ) {
			tags.push( {
				type: option.type,
				modifier: option.value,
				label: option.label,
				icon: option.iconBox?.icon,
				color: option.iconBox?.color,
			} );
		}
	}

	return (
		<div className="combobox-control-rich-text">
			{ isToggleEnabled && (
				<Button
					className="combobox-control-rich-text-back"
					onClick={ () => onChange( {} ) }
				>
					<Icon icon={ closeSmall } />
				</Button>
			) }
			<RichTextControl
				id={ id }
				value={ value.value ?? '' }
				setValue={ ( $value ) =>
					onChange( { type: 'text', value: $value } )
				}
				mergeTags={ tags }
				allowedFormats={ allowedFormats }
				placeholder={ placeholder }
			/>
		</div>
	);
};

export default RichText;
