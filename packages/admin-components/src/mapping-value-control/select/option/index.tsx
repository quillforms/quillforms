/**
 * QuillForms Dependencies
 */
import type { IconRenderer } from '@quillforms/types';

/**
 * External Dependencies
 */
import BlockIconBox from '../../../block-icon-box';

/**
 * Internal Dependencies
 */

export type MappingValue = {
	type?: string;
	value?: string;
};

interface Props {
	label: string;
	iconBox?: {
		icon?: IconRenderer;
		color?: string;
	};
	hasSection?: boolean;
}

const Option: React.FC< Props > = ( { label, iconBox, hasSection } ) => {
	return (
		<div
			className={
				'mapping-value-control-select-option' +
				( hasSection ? ' mapping-value-control-select-option-has_section' : '' )
			}
		>
			{ !! iconBox && (
				<BlockIconBox icon={ iconBox.icon } color={ iconBox.color } />
			) }
			<div className="mapping-value-control-select-option-label">
				{ label }
			</div>
		</div>
	);
};

export default Option;
