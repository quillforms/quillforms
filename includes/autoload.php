<?php
/**
 * Register autoload function
 *
 * @since 1.0.0
 * @package QuillForms
 */

defined( 'ABSPATH' ) || exit;

spl_autoload_register( 'quillforms_autoload' );

/**
 * Autoloader function
 *
 * @param string $class class name.
 * @return void
 */
function quillforms_autoload( $class ) {
	$class_breakdown = explode( '\\', $class );
	if ( array_shift( $class_breakdown ) === 'QuillForms' ) {
		$class_breakdown   = array_map(
			function( $value ) {
				return str_replace( '_', '-', strtolower( $value ) );
			},
			$class_breakdown
		);
		$class_breakdown[] = 'class-' . array_pop( $class_breakdown );
		$class_file        = QUILLFORMS_PLUGIN_DIR . 'includes/' . implode( '/', $class_breakdown ) . '.php';
		if ( file_exists( $class_file ) ) {
			include $class_file;
		}
	}
}
