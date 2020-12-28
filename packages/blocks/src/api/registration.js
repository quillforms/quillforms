import { dispatch } from '@wordpress/data';
/**
 * Register blocks.
 * The function is mainly for having an api to register blocks from server side.
 *
 * @param {Object} blocks The registered blocks.
 */
export const registerBlockType = ( blocks ) => {
	dispatch( 'quillForms/blocks' ).__unstableRegisterServerSideBlocks(
		blocks
	);
};
