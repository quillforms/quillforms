<?php
/**
 * Server-side rendering of the `core/post-comments` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-comments` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the filtered post comments for the current post wrapped inside "p" tags.
 */
function gutenberg_render_block_core_post_comments( $attributes, $content, $block ) {
	global $post;

	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	$post_before = $post;

	$post = get_post( $block->context['postId'] );
	setup_postdata( $post );

	// This generates a deprecate message.
	// Ideally this deprecation is removed.
	ob_start();
	comments_template();
	$post = $post_before;

	$classes = '';
	if ( isset( $attributes['textAlign'] ) ) {
		$classes .= 'has-text-align-' . $attributes['textAlign'];
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );
	$output             = sprintf( '<div %1$s>', $wrapper_attributes ) . ob_get_clean() . '</div>';
	return $output;
}

/**
 * Registers the `core/post-comments` block on the server.
 */
function gutenberg_register_block_core_post_comments() {
	register_block_type_from_metadata(
		__DIR__ . '/post-comments',
		array(
			'render_callback' => 'gutenberg_render_block_core_post_comments',
		)
	);
}
add_action( 'init', 'gutenberg_register_block_core_post_comments', 20 );
