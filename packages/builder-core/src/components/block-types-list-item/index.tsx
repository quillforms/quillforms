import classNames from 'classnames';
import { memo } from '@wordpress/element';
import { Icon, Dashicon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';
import { FC } from 'react';

const areEqual = ( prevProps: Props, nextProps: Props ): boolean => {
	if ( prevProps.disabled === nextProps.disabled ) return true;
	return false;
};
interface Props {
	disabled: boolean;
	blockName: string;
}
const BlockTypesListItem: FC< Props > = memo( ( { disabled, blockName } ) => {
	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: select( 'quillForms/blocks' ).getBlockType( blockName ),
		};
	} );

	if ( ! blockType ) return null;
	let { icon } = blockType;
	if ( ( icon as IconDescriptor )?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}
	if ( ! icon ) icon = plus;
	const renderedIcon = (
		<Icon
			icon={
				( ( icon as IconDescriptor ).src as IconType )
					? ( ( icon as IconDescriptor ).src as IconType )
					: ( icon as Dashicon.Icon )
			}
		/>
	);

	return (
		<div
			className={ classNames( 'admin-components-blocks-list-item', {
				disabled: disabled ? true : false,
			} ) }
		>
			<span
				className="admin-components-blocks-list-item__icon-wrapper"
				style={ {
					backgroundColor: blockType?.color
						? blockType.color
						: '#bb426f',
				} }
			>
				<span className="admin-components-blocks-list-item__icon">
					{ renderedIcon }
				</span>
			</span>
			<span className="admin-components-blocks-list-item__block-name">
				{ blockType?.title }
			</span>
		</div>
	);
}, areEqual );

export default BlockTypesListItem;
