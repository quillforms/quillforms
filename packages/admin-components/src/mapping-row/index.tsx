/**
 * WordPress Dependencies
 */
import { plus, trash } from '@wordpress/icons';
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

const MappingRow: React.FC< Props > = ( {
	keyProps,
	valueProps,
	onAddClick,
	onRemoveClick,
} ) => {
	return (
		<div className="mapping-row">
			<MappingKeyControl { ...keyProps } />
			<div className="mapping-row-separator"></div>
			<ComboboxControl { ...valueProps } />
			<div className="mapping-row-buttons">
				{ !! onRemoveClick && (
					<div className="mapping-row-buttons-remove">
						<Icon icon={ trash } onClick={ onRemoveClick } />
					</div>
				) }
				{ !! onAddClick && (
					<div className="mapping-row-buttons-add">
						<Icon icon={ plus } onClick={ onAddClick } />
					</div>
				) }
			</div>
		</div>
	);
};

export default MappingRow;
