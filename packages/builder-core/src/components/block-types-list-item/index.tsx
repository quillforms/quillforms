/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { memo, useState, useEffect } from '@wordpress/element';
import { Icon, Dashicon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { FC } from 'react';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { css } from 'emotion';

const areEqual = ( prevProps: Props, nextProps: Props ): boolean => {
	if ( prevProps.disabled === nextProps.disabled ) return true;
	return false;
};
interface Props {
	disabled: boolean;
	blockName: string;
	index: number;
	disableAnimation?: boolean;
}
const BlockTypesListItem: FC< Props > = memo(
	( { disabled, blockName, index, disableAnimation } ) => {
		const [ isMounted, setIsMounted ] = useState( false );

		useEffect( () => {
			setTimeout( () => {
				setIsMounted( true );
			}, 50 );
		}, [] );
		const { blockType } = useSelect( ( select ) => {
			return {
				blockType: select( 'quillForms/blocks' ).getBlockType(
					blockName
				),
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
				className={ classNames(
					'admin-components-blocks-list-item',
					css`
						&:not( .animation-disabled ) {
							opacity: 0;
							transform: scale( 0.6 );
							transition: all 0.3s ease;
							transition-delay: ${ index * 0.05 }s;

							&.mounted {
								opacity: 1;
								transform: scale( 1 );
							}
						}
					`,
					{
						disabled: disabled ? true : false,
						mounted: isMounted,
						'animation-disabled': disableAnimation,
					}
				) }
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
	},
	areEqual
);

export default BlockTypesListItem;
