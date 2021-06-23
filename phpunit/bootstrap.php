<?php
/**
 * PHPUnit bootstrap file
 *
 * @package QuillForms
 */

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available.
require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// Give access to tests_add_filter() function.
require_once getenv( 'WP_PHPUNIT__DIR' ) . '/includes/functions.php';

tests_add_filter(
	'muplugins_loaded',
	function() {
		require dirname( __DIR__ ) . '/quillforms.php';
	}
);

// Start up the WP testing environment.
require getenv( 'WP_PHPUNIT__DIR' ) . '/includes/bootstrap.php';

// Include factories.
foreach ( glob( __DIR__ . '/factories/*.php' ) as $factory_filename ) {
	require_once $factory_filename;
}
