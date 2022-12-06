<?php
/**
 * Functions to register client assets for builder and renderer modes.
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Assets
 */

defined( 'ABSPATH' ) || die( 'Silence is golden.' );
use QuillForms\Settings;

/**
 * Retrieves a URL to a file in the quillforms plugin.
 *
 * @param string $path relative path of the desired file.
 *
 * @return string fully qualified URL pointing to the desired file.
 *
 * @since 1.0.0
 */
function quillforms_url( $path ) {
	return plugins_url( $path, dirname( __FILE__ ) );
}

/**
 * Registers a style according to `wp_register_style`. Honors this request by
 * deregistering any style by the same handler before registration.
 *
 * @since 1.0.0
 *
 * @param WP_Styles        $styles WP_Styles instance.
 * @param string           $handle Name of the stylesheet. Should be unique.
 * @param string           $src    full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
 * @param array            $deps   Optional. An array of registered stylesheet handles this stylesheet depends on. Default empty array.
 * @param string|bool|null $ver    Optional. String specifying stylesheet version number, if it has one, which is added to the URL
 *                                 as a query string for cache busting purposes. If version is set to false, a version
 *                                 number is automatically added equal to current installed WordPress version.
 *                                 If set to null, no version is added.
 * @param string           $media  Optional. The media for which this stylesheet has been defined.
 *                                 Default 'all'. Accepts media types like 'all', 'print' and 'screen', or media queries like
 *                                 '(orientation: portrait)' and '(max-width: 640px)'.
 */
function quillforms_override_style( $styles, $handle, $src, $deps = array(), $ver = false, $media = 'all' ) {
	$style = $styles->query( $handle, 'registered' );
	if ( $style ) {
		$styles->remove( $handle );
	}
	$styles->add( $handle, $src, $deps, $ver, $media );
}

/**
 * Registers a script according to `wp_register_script`. Honors this request by
 * reassigning internal dependency properties of any script handle already
 * registered by that name. It does not deregister the original script, to
 * avoid losing inline scripts which may have been attached.
 *
 * @since 1.0.0
 *
 * @param WP_Scripts       $scripts   WP_Scripts instance.
 * @param string           $handle    Name of the script. Should be unique.
 * @param string           $src       full URL of the script, or path of the script relative to the WordPress root directory.
 * @param array            $deps      Optional. An array of registered script handles this script depends on. Default empty array.
 * @param string|bool|null $ver       Optional. String specifying script version number, if it has one, which is added to the URL
 *                                    as a query string for cache busting purposes. If version is set to false, a version
 *                                    number is automatically added equal to current installed WordPress version.
 *                                    If set to null, no version is added.
 * @param bool             $in_footer Optional. Whether to enqueue the script before </body> instead of in the <head>.
 *                                    Default 'false'.
 * @param string           $text_domain Optional. Text domain.
 * @param string|null      $domain_path Optional. Domain path.
 */
function quillforms_override_script( $scripts, $handle, $src, $deps = array(), $ver = false, $in_footer = false, $text_domain = 'quillforms', $domain_path = null ) {
	$script = $scripts->query( $handle, 'registered' );
	if ( $script ) {
		/*
		 * In many ways, this is a reimplementation of `wp_register_script` but
		 * bypassing consideration of whether a script by the given handle had
		 * already been registered.
		 */

		// See: `_WP_Dependency::__construct` .
		$script->src  = $src;
		$script->deps = $deps;
		$script->ver  = $ver;
		$script->args = $in_footer;

		/*
		 * The script's `group` designation is an indication of whether it is
		 * to be printed in the header or footer. The behavior here defers to
		 * the arguments as passed. Specifically, group data is not assigned
		 * for a script unless it is designated to be printed in the footer.
		 */

		// See: `wp_register_script` .
		unset( $script->extra['group'] );
		if ( $in_footer ) {
			$script->add_data( 'group', 1 );
		}
	} else {
		$scripts->add( $handle, $src, $deps, $ver, $in_footer );
	}

	/*
	 * `WP_Dependencies::set_translations` will fall over on itself if setting
	 * translations on the `wp-i18n` handle, since it internally adds `wp-i18n`
	 * as a dependency of itself, exhausting memory. The same applies for the
	 * polyfill script, which is a dependency _of_ `wp-i18n`.
	 *
	 * See: https://core.trac.wordpress.org/ticket/46089
	 */
	if ( 'wp-i18n' !== $handle && 'wp-polyfill' !== $handle ) {
		$scripts->set_translations( $handle, $text_domain, $domain_path );
	}
}

/**
 * Registers all the QuillForms packages scripts that are in the standardized
 * `build/` location.
 *
 * @since 1.0.0
 *
 * @param WP_Scripts $scripts   WP_Scripts instance.
 */
function quillforms_register_packages_scripts( $scripts ) {
	foreach ( glob( QUILLFORMS_PLUGIN_DIR . 'build/*/index.js' ) as $path ) {
		// Prefix `quillforms-` to package directory to get script handle.
		$handle = 'quillforms-' . basename( dirname( $path ) );

		// Replace `.js` extension with `.asset.php` to find the generated dependencies file.
		$asset_file   = substr( $path, 0, -3 ) . '.asset.php';
		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( $path );

		if ( strpos( $handle, 'blocklib' ) !== false ) {
			return;
		}
		// Add dependencies that cannot be detected and generated by build tools.
		switch ( $handle ) {
			case 'quillforms-builder-core':
				array_push( $dependencies, 'media-models', 'media-views', 'common', 'postbox', 'wp-dom-ready' );
				break;
		}

		// Get the path from Gutenberg directory as expected by `quillforms_url`.
		$quillforms_path = substr( $path, strlen( QUILLFORMS_PLUGIN_DIR ) );

		quillforms_override_script(
			$scripts,
			$handle,
			plugins_url( $quillforms_path, dirname( __FILE__ ) ),
			$dependencies,
			$version,
			true
		);
	}

	foreach ( glob( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-**-block/admin/index.js' ) as $path ) {
		// Prefix `quillforms-` to package directory to get script handle.
		preg_match( '/blocklib-([a-zA-Z-]+)-block\/admin\/index.js$/', $path, $matches );
		$handle = 'quillforms-blocklib-' . $matches[1] . '-block-admin-script';

		// Replace `.js` extension with `.asset.php` to find the generated dependencies file.
		$asset_file   = substr( $path, 0, -3 ) . '.asset.php';
		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( $path );

		// Get the path from Gutenberg directory as expected by `quillforms_url`.
		$quillforms_path = substr( $path, strlen( QUILLFORMS_PLUGIN_DIR ) );

		quillforms_override_script(
			$scripts,
			$handle,
			plugins_url( $quillforms_path, dirname( __FILE__ ) ),
			$dependencies,
			$version,
			true
		);
	}

	foreach ( glob( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-**-block/renderer/index.js' ) as $path ) {
		// Prefix `quillforms-` to package directory to get script handle.
		preg_match( '/blocklib-([a-zA-Z-]+)-block\/renderer\/index.js$/', $path, $matches );
		$handle = 'quillforms-blocklib-' . $matches[1] . '-block-renderer-script';
		// Replace `.js` extension with `.asset.php` to find the generated dependencies file.
		$asset_file   = substr( $path, 0, -3 ) . '.asset.php';
		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( $path );

		// Get the path from Gutenberg directory as expected by `quillforms_url`.
		$quillforms_path = substr( $path, strlen( QUILLFORMS_PLUGIN_DIR ) );

		quillforms_override_script(
			$scripts,
			$handle,
			plugins_url( $quillforms_path, dirname( __FILE__ ) ),
			$dependencies,
			$version,
			true
		);
	}

	quillforms_override_script(
		$scripts,
		'emotion',
		QUILLFORMS_PLUGIN_URL . '/lib/vendor/emotion.min.js',
		array( 'react', 'wp-element' ),
		'1.8.6',
		true
	);

	quillforms_override_script(
		$scripts,
		'quillforms-google-maps-places',
		'https://maps.googleapis.com/maps/api/js?key=' . Settings::get( 'google_maps_api_key' ) . '&libraries=places',
		array(),
		QUILLFORMS_VERSION,
		true
	);

}

/**
 * Registers all the QuillForms packages styles that are in the standardized
 * `build/` location.
 *
 * @since 1.0.0
 *
 * @param WP_Styles $styles WP_Styles instance.
 */
function quillforms_register_packages_styles( $styles ) {
	// Builder Core.
	quillforms_override_style(
		$styles,
		'quillforms-builder-core',
		quillforms_url( 'build/builder-core/style.css' ),
		array(
			'quillforms-admin-components',
			'quillforms-block-editor',
			'quillforms-renderer-core',
			'quillforms-theme-editor',
			'quillforms-notifications-editor',
			'quillforms-messages-editor',
			'quillforms-form-integrations',
			'wp-components',
			'common',
		),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/builder-core/style.css' )
	);
	$styles->add_data( 'quillforms-builder-core', 'rtl', 'replace' );

	// Builder Components.
	quillforms_override_style(
		$styles,
		'quillforms-admin-components',
		quillforms_url( 'build/admin-components/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/builder-core/style.css' )
	);
	$styles->add_data( 'quillforms-admin-components', 'rtl', 'replace' );

	// Block Editor.
	quillforms_override_style(
		$styles,
		'quillforms-block-editor',
		quillforms_url( 'build/block-editor/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/block-editor/style.css' )
	);
	$styles->add_data( 'quillforms-block-editor', 'rtl', 'replace' );

	// Notifications Editor.
	quillforms_override_style(
		$styles,
		'quillforms-notifications-editor',
		quillforms_url( 'build/notifications-editor/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/notifications-editor/style.css' )
	);
	$styles->add_data( 'quillforms-notifications-editor', 'rtl', 'replace' );

	// Renderer Core.
	quillforms_override_style(
		$styles,
		'quillforms-renderer-core',
		quillforms_url( 'build/renderer-core/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/renderer-core/style.css' )
	);
	$styles->add_data( 'quillforms-renderer-core', 'rtl', 'replace' );

	// Theme Editor.
	quillforms_override_style(
		$styles,
		'quillforms-theme-editor',
		quillforms_url( 'build/theme-editor/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/theme-editor/style.css' )
	);
	$styles->add_data( 'quillforms-theme-editor', 'rtl', 'replace' );

	// Messages Editor.
	quillforms_override_style(
		$styles,
		'quillforms-messages-editor',
		quillforms_url( 'build/messages-editor/style.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/messages-editor/style.css' )
	);
	$styles->add_data( 'quillforms-messages-editor', 'rtl', 'replace' );

	// Form Integrations.
	quillforms_override_style(
		$styles,
		'quillforms-form-integrations',
		quillforms_url( 'build/form-integrations/style.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/form-integrations/style.css' )
	);
	$styles->add_data( 'quillforms-form-integrations', 'rtl', 'replace' );

	// Client style.
	quillforms_override_style(
		$styles,
		'quillforms-client',
		quillforms_url( 'build/style.css' ),
		array( 'quillforms-admin-components', 'wp-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/style.css' )
	);
	$styles->add_data( 'quillforms-client', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-date-block-admin-style',
		quillforms_url( 'build/blocklib-date-block/admin.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-date-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-date-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-date-block-renderer-style',
		quillforms_url( 'build/blocklib-date-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-date-block/renderer.css' )
	);

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-dropdown-block-admin-style',
		quillforms_url( 'build/blocklib-dropdown-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-dropdown-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-dropdown-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-dropdown-block-renderer-style',
		quillforms_url( 'build/blocklib-dropdown-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-dropdown-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-dropdown-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-email-block-admin-style',
		quillforms_url( 'build/blocklib-email-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-email-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-email-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-email-block-renderer-style',
		quillforms_url( 'build/blocklib-email-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-email-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-email-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-long-text-block-admin-style',
		quillforms_url( 'build/blocklib-long-text-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-long-text-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-long-text-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-long-text-block-renderer-style',
		quillforms_url( 'build/blocklib-long-text-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-long-text-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-long-text-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-multiple-choice-block-admin-style',
		quillforms_url( 'build/blocklib-multiple-choice-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-multiple-choice-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-multiple-choice-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-multiple-choice-block-renderer-style',
		quillforms_url( 'build/blocklib-multiple-choice-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-multiple-choice-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-multiple-choice-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-number-block-admin-style',
		quillforms_url( 'build/blocklib-number-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-number-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-number-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-number-block-renderer-style',
		quillforms_url( 'build/blocklib-number-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-number-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-number-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-short-text-block-admin-style',
		quillforms_url( 'build/blocklib-short-text-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-short-text-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-short-text-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-short-text-block-renderer-style',
		quillforms_url( 'build/blocklib-short-text-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-short-text-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-short-text-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-statement-block-admin-style',
		quillforms_url( 'build/blocklib-statement-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-statement-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-statement-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-statement-block-renderer-style',
		quillforms_url( 'build/blocklib-statement-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-statement-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-statement-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-website-block-admin-style',
		quillforms_url( 'build/blocklib-website-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-website-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-website-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-website-block-renderer-style',
		quillforms_url( 'build/blocklib-website-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-website-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-website-block-renderer-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-welcome-screen-block-admin-style',
		quillforms_url( 'build/blocklib-welcome-screen-block/admin.css' ),
		array( 'quillforms-admin-components' ),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-welcome-screen-block/admin.css' )
	);

	$styles->add_data( 'quillforms-blocklib-welcome-screen-block-admin-style', 'rtl', 'replace' );

	quillforms_override_style(
		$styles,
		'quillforms-blocklib-welcome-screen-block-renderer-style',
		quillforms_url( 'build/blocklib-welcome-screen-block/renderer.css' ),
		array(),
		filemtime( QUILLFORMS_PLUGIN_DIR . 'build/blocklib-welcome-screen-block/renderer.css' )
	);

	$styles->add_data( 'quillforms-blocklib-welcome-screen-block-renderer-style', 'rtl', 'replace' );

}
add_action( 'wp_default_scripts', 'quillforms_register_packages_scripts' );
add_action( 'wp_default_styles', 'quillforms_register_packages_styles' );
