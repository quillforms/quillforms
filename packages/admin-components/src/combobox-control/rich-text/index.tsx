/**
 * QuillForms Dependencies
 */
import { MergeTags, RichTextControl } from '../../rich-text';
import Button from '../../button';

/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useComboboxControlContext } from '../context';

interface Props {}

const RichText: React.FC< Props > = ( {} ) => {
	const {
		// sections,
		options,
		value,
		onChange,
		isToggleEnabled,
		placeholder,
	} = useComboboxControlContext();

	const isMounted = useRef( false );

	let tags: MergeTags = [];
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

	useEffect( () => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, [] );

	return (
		<div className="combobox-control-rich-text">
			{ isToggleEnabled && (
				<Button
					className="combobox-control-rich-text-back"
					onClick={ () => {
						if ( isMounted.current ) {
							onChange( {} );
						}
					} }
				>
					<Icon icon={ arrowLeft } />
				</Button>
			) }
			<RichTextControl
				value={ value.value ?? '' }
				setValue={ ( value ) => {
					if ( isMounted.current ) {
						onChange( { type: 'text', value } );
					}
				} }
				mergeTags={ tags }
				placeholder={ placeholder }
			/>
		</div>
	);
};

export default RichText;
