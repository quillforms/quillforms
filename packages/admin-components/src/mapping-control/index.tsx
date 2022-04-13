/**
 * WordPress Dependencies
 */
import { plus, closeSmall } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import {
	default as MappingKeyControl,
	MappingKeyControlProps,
} from './key-control';
import {
	default as ComboboxControl,
	ComboboxControlProps,
} from '../combobox-control';

interface Props {
	keyProps: MappingKeyControlProps;
	valueProps: ComboboxControlProps;
	onAddClick?: () => void;
	onRemoveClick?: () => void;
}

const MappingControl: React.FC< Props > = ( {
	keyProps,
	valueProps,
	onAddClick,
	onRemoveClick,
} ) => {
	return (
		<div className="mapping-control">
			<MappingKeyControl { ...keyProps } />
			<div className="mapping-control-separator"></div>
			<ComboboxControl { ...valueProps } />
			<div className="mapping-control-buttons">
				{ !! onRemoveClick && (
					<div className="mapping-control-buttons-remove">
						<Icon icon={ closeSmall } onClick={ onRemoveClick } />
					</div>
				) }
				{ !! onAddClick && (
					<div className="mapping-control-buttons-add">
						<Icon icon={ plus } onClick={ onAddClick } />
					</div>
				) }
			</div>
		</div>
	);
};

export default MappingControl;
