/**
 * WordPress Dependencies
 */
import { starFilled } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

export type MappingValue = {
	type?: string;
	value?: string;
};

interface Props {
	label: string;
	isStarred?: boolean;
	hasSection?: boolean;
}

const Option: React.FC< Props > = ( { label, isStarred, hasSection } ) => {
	return (
		<div
			className={
				'mapping-key-control-select-option' +
				( hasSection
					? ' mapping-key-control-select-option-has_section'
					: '' )
			}
		>
			{ isStarred && (
				<Icon
					className="mapping-key-control-select-option-icon"
					icon={ starFilled }
				/>
			) }
			<div className="mapping-key-control-select-option-label">
				{ label }
			</div>
		</div>
	);
};

export default Option;
