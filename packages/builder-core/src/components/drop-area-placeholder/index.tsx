/**
 * External Dependencies
 */
import { css } from 'emotion';
import { BlockTypesListDropdown } from '@quillforms/admin-components';
import { __ } from "@wordpress/i18n";

const DropAreaPlaceholder: React.FC = () => {
	return (
		<div
			className={css`
				display: flex;
				align-items: center;
				padding: 20px;
			` }
		>
			<BlockTypesListDropdown destinationIndex={0} color="primary" />
			<span
				className={css`
					font-size: 14px;
				` }
			>
				{__('Add your first question', 'quillforms')}
			</span>
		</div>
	);
};

export default DropAreaPlaceholder;
