<?php
/**
 * Server-side rendering of the `core/query` block.
 *
 * @package WordPress
 */

/**
 * Registers the `core/query` block on the server.
 */
function gutenberg_register_block_core_query() {
	register_block_type_from_metadata(
		__DIR__ . '/query'
	);
}
add_action( 'init', 'gutenberg_register_block_core_query', 20 );
