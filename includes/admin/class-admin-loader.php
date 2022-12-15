<?php
/**
 * Admin: class Admin_Loader
 *
 * @since 1.0.0
 * @package Admin
 * @subpackage Loader
 */

namespace QuillForms\Admin;

use QuillForms\Core;
use QuillForms\Managers\Blocks_Manager;

/**
 * Register the scripts, styles, and includes needed for pieces of the QuillForms Admin experience.
 */
class Admin_Loader {

	/**
	 * Class instance.
	 *
	 * @var Admin_Loader instance
	 */
	private static $instance = null;

	/**
	 * Get class instance.
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Returns true if we are on a JS powered admin page.
	 */
	public static function is_admin_page() : bool {
		$current_screen = get_current_screen();
		if ( 'toplevel_page_quillforms' === $current_screen->id ) {
			return true;
		}
		return false;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'add_inline_scripts' ), 14 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'localize_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'remove_all_scripts' ), 999 );


		/*
		* Remove the emoji script.
		* We have faced an issue when using emojis with Slate React rich text editor; they were converted to images.
		* Now after removing this action, they are working correctly.
		*/
		remove_action( 'wp_head', 'print_emoji_detection_script', 20 );
		add_action( 'admin_init', [ $this, 'disable_admin_emojis' ] );
		// Remove DNS prefetch s.w.org (used for emojis, since WP 4.7)





		add_action( 'admin_head', array( __CLASS__, 'remove_notices' ) );
		add_action( 'admin_notices', array( __CLASS__, 'inject_before_notices' ), -9999 );
		add_action( 'admin_notices', array( __CLASS__, 'inject_after_notices' ), PHP_INT_MAX );
		add_filter( 'admin_body_class', array( __CLASS__, 'add_admin_body_class' ), PHP_INT_MAX );



	}

	/**
	 * Add admin body class.
	 *
	 * @since 1.0.0
	 *
	 * @param string $classes Body classes.
	 */
	public static function add_admin_body_class( $classes ) {
		if ( self::is_admin_page() ) {
			$classes .= ' js is-fullscreen-mode';
		}

		return $classes;
	}

	/**
	 * Localize scripts
	 *
	 * @since 1.0.0
	 */
	public static function localize_scripts() {
		global $submenu;
		$user = wp_get_current_user();

		wp_localize_script(
			'quillforms-client',
			'qfAdmin',
			array(
				'adminUrl'                => admin_url(),
				'assetsBuildUrl'          => QUILLFORMS_PLUGIN_URL,
				'submenuPages'            => $submenu['quillforms'],
				'site_store_nonce'        => wp_create_nonce( 'quillforms_site_store' ),
				'license_nonce'           => wp_create_nonce( 'quillforms_license' ),
				'current_user_name'       => $user->display_name,
				'current_user_avatar_url' => esc_url(
					get_avatar_url( $user->ID )
				),
			)
		);
	}

	/**
	 * Remove all scripts
	 *
	 * @since 1.0.0
	 */
	public static function remove_all_scripts() {
		global $wp_scripts;

		if ( self::is_admin_page() ) {
			$wp_scripts->queue = array( 'jquery', 'media-audiovideo' );
			wp_enqueue_media();
		}
	}

	/**
	 * Add inline scripts.
	 *
	 * @since 1.0.0
	 */
	public static function add_inline_scripts() {
		Core::register_block_types_by_js();
		Core::set_admin_config();
		Core::add_gallery_themes();
	}

	/**
	 * Removes notices that should not be displayed on QF Admin pages.
	 *
	 * @since 1.0.0
	 */
	public static function remove_notices() {
		if ( ! self::is_admin_page() ) {
			return;
		}

		// Hello Dolly.
		if ( function_exists( 'hello_dolly' ) ) {
			remove_action( 'admin_notices', 'hello_dolly' );
		}
	}

	/**
	 * Runs before admin notices action and hides them.
	 *
	 * @since 1.0.0
	 */
	public static function inject_before_notices() {
		if ( ! self::is_admin_page() ) {
			return;
		}

		// Wrap the notices in a hidden div to prevent flickering before
		// they are moved elsewhere in the page by WordPress Core.
		echo '<div class="quillforms-layout__notice-list-hide" style="display: none;" id="wp__notice-list">';

		if ( self::is_admin_page() ) {
			// Capture all notices and hide them. WordPress Core looks for
			// `.wp-header-end` and appends notices after it if found.
			// https://github.com/WordPress/WordPress/blob/f6a37e7d39e2534d05b9e542045174498edfe536/wp-admin/js/common.js#L737 .
			echo '<div class="wp-header-end" id="quillforms-layout__notice-catcher"></div>';
		}
	}

	/**
	 * Runs after admin notices and closes div.
	 *
	 * @since 1.0.0
	 */
	public static function inject_after_notices() {
		if ( ! self::is_admin_page() ) {
				return;
		}
		// Close the hidden div used to prevent notices from flickering before
		// they are inserted elsewhere in the page.
		echo '</div>';
	}

	/**
	 * Set up a div for the app to render into.
	 */
	public static function page_wrapper() {
		?>
		<?php
		add_filter( 'emoji_svg_url', '__return_false' );
		if ( get_site_option( 'initial_db_version' ) >= 32453 )
			remove_action( 'init', 'smilies_init', 5 ); // This re


		// Load client script and style. Client is main app entry.
		wp_enqueue_script( 'quillforms-client' );
		wp_enqueue_style( 'quillforms-client' );
		// Load builder core package style.
		wp_enqueue_style( 'quillforms-builder-core' );

		// Important to check for authentication.
		wp_auth_check_load();

		// load all block styles and scripts.
		foreach ( Blocks_Manager::instance()->get_all_registered() as $block ) {
			if ( ! empty( $block->block_admin_assets ) ) {
				if ( ! empty( $block->block_admin_assets['style'] ) ) {
					wp_enqueue_style( $block->block_admin_assets['style'] );
				}
				if ( ! empty( $block->block_admin_assets['script'] ) ) {
					wp_enqueue_script( $block->block_admin_assets['script'] );
				}
			}

			if ( ! empty( $block->block_renderer_assets ) ) {
				if ( ! empty( $block->block_renderer_assets['style'] ) ) {
					wp_enqueue_style( $block->block_renderer_assets['style'] );
				}
				if ( ! empty( $block->block_renderer_assets['script'] ) ) {
					wp_enqueue_script( $block->block_renderer_assets['script'] );
				}
			}
		}
		?>
		<div class="wrap">
			<div id="qf-admin-root">
				<div id="qf-admin-root__loader-container" style="
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 600px;
				">
					<svg viewBox="0 0 95 95" width="80px" height="80px">
						<defs>
							<clipPath id="_clipPath_kOTYkDI0w4OkXPM1kIsIznMY6S2kafD3">
								<rect width="95" height="95" />
							</clipPath>
						</defs>
						<g clipPath="url(#_clipPath_kOTYkDI0w4OkXPM1kIsIznMY6S2kafD3)">
							<linearGradient
								id="_lgradient_12"
								x1="171.18907"
								y1="90.6548"
								x2="126.56409"
								y2="125.34236000000001"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(42,86,132);"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(0,175,239);"
								/>
							</linearGradient>
							<path
								d=" M 54.886 61.279 C 35.697 55.97 21.638 41.984 27.946 21.599 C 27.946 21.599 14.842 37.616 30.785 57.595 C 30.785 57.595 23.348 55.303 20.334 47.826 C 20.334 47.826 21.941 68.924 53.066 66.011 C 53.066 66.011 49.347 71.538 35.045 68.195 C 35.045 68.195 44.874 75.657 66.596 75.657 C 75.095 75.657 83.877 84.892 88.686 94 C 85.156 82.209 76.388 67.74 54.886 61.279 Z "
								fill="url(#_lgradient_12)"
							/>
							<linearGradient
								id="_lgradient_13"
								x1="141.08428"
								y1="142.3715"
								x2="167.544"
								y2="105.50069"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(140,59,139);"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(235,40,143);"
								/>
							</linearGradient>
							<path
								d=" M 56.646 41.681 C 56.646 41.681 58.385 48.699 72.663 60.612 C 82.189 68.56 86.774 84.839 86.774 84.839 C 74.981 62.491 63.804 62.916 45.421 54.726 C 22.492 44.51 29.707 19.353 29.707 19.353 C 29.707 19.353 32.619 40.104 43.055 45.503 C 43.055 45.503 41.053 38.527 43.236 31.61 C 43.236 31.61 43.358 44.776 58.284 53.513 C 58.284 53.513 54.279 47.081 56.646 41.681 Z "
								fill="url(#_lgradient_13)"
							/>
							<linearGradient
								id="_lgradient_14"
								x1="132.92447"
								y1="173.82841"
								x2="182.45367"
								y2="130.10655"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(42,86,132)"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(0,175,239)"
								/>
							</linearGradient>
							<path
								d=" M 86.263 40.216 C 86.263 18.005 68.257 0 46.046 0 C 43.32 0 40.658 0.274 38.084 0.792 C 34.08 6.28 31.846 11.667 30.622 15.594 C 35.473 12.52 41.213 10.72 47.345 10.72 C 64.646 10.72 78.67 24.745 78.67 42.046 C 78.67 47.588 77.214 52.783 74.689 57.298 C 80.377 62.618 84.593 73.458 84.593 73.458 C 83.799 68.354 82.492 64.191 81.077 60.3 C 84.707 53.493 86.263 47.158 86.263 40.216 Z "
								fill="url(#_lgradient_14)"
							/>
							<linearGradient
								id="_lgradient_15"
								x1="124.31395"
								y1="101.90494"
								x2="99.56409"
								y2="152.34236"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(140,59,139)"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(235,40,143)"
								/>
							</linearGradient>
							<path
								d=" M 5.829 40.216 C 5.829 62.428 23.834 80.433 46.046 80.433 C 50.348 80.433 54.49 79.751 58.376 78.499 C 48.658 78.345 42.796 76.388 38.4 74.507 C 31.12 71.232 16.247 62.703 16.018 42.046 C 15.897 31.04 21.783 21.194 30.622 15.594 C 31.846 11.667 34.08 6.28 38.084 0.792 C 19.687 4.486 5.829 20.731 5.829 40.216 Z "
								fill="url(#_lgradient_15)"
							/>
							<linearGradient
								id="_lgradient_16"
								x1="139.74491"
								y1="123.55313"
								x2="118.25858"
								y2="136.15909"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(42,86,132);"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(0,175,239)"
								/>
							</linearGradient>
							<path
								d=" M 47.911 58.864 C 32.479 52.345 22.433 39.417 27.946 21.599 C 27.946 21.599 14.842 37.616 30.785 57.595 C 30.785 57.595 23.348 55.303 20.334 47.826 C 20.334 47.826 20.813 54.105 26.302 59.34 C 29.439 59.967 32.697 60.3 36.041 60.3 C 40.15 60.3 44.129 59.798 47.911 58.864 Z "
								fill="url(#_lgradient_16)"
							/>
							<linearGradient
								id="_lgradient_17"
								x1="134.43987"
								y1="148.73584"
								x2="149.74781"
								y2="126.84643"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(140,59,139)"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(235,40,143)"
								/>
							</linearGradient>
							<path
								d=" M 56.646 41.681 C 56.646 41.681 57.555 45.346 63.446 51.873 C 60.068 54.224 56.313 56.15 52.276 57.565 C 50.102 56.719 47.824 55.797 45.421 54.726 C 22.492 44.51 29.707 19.353 29.707 19.353 C 29.707 19.353 32.619 40.104 43.055 45.503 C 43.055 45.503 41.053 38.527 43.236 31.61 C 43.236 31.61 43.358 44.776 58.284 53.513 C 58.284 53.513 54.279 47.081 56.646 41.681 Z "
								fill="url(#_lgradient_17)"
							/>
							<linearGradient
								id="_lgradient_18"
								x1="144.3668"
								y1="182.42135"
								x2="165.06028"
								y2="147.4217"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(42,86,132)"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(0,175,239)"
								/>
							</linearGradient>
							<path
								d=" M 81.063 20.428 C 74.156 8.232 61.064 0 46.046 0 C 43.32 0 40.658 0.274 38.084 0.792 C 34.08 6.28 31.846 11.667 30.622 15.594 C 35.473 12.52 41.213 10.72 47.345 10.72 C 62.136 10.72 74.53 20.972 77.816 34.757 C 79.795 30.315 80.937 25.486 81.063 20.428 Z "
								fill="url(#_lgradient_18)"
							/>
							<linearGradient
								id="_lgradient_19"
								x1="117.30813"
								y1="124.32161"
								x2="98.16378"
								y2="157.97027"
								gradientTransform="matrix(1,0,0,-1,-95.226,176.556)"
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									stopOpacity="1"
									style="stop-color: rgb(140,59,139)"
								/>
								<stop
									offset="100%"
									stopOpacity="1"
									style="stop-color: rgb(235,40,143)"
								/>
							</linearGradient>
							<path
								d=" M 5.829 40.216 C 5.829 43.908 6.329 47.482 7.26 50.877 C 10.911 53.63 15.049 55.869 19.541 57.473 C 17.457 53.288 16.087 48.207 16.018 42.046 C 15.897 31.04 21.783 21.194 30.622 15.594 C 31.846 11.667 34.08 6.28 38.084 0.792 C 19.687 4.486 5.829 20.731 5.829 40.216 Z "
								fill="url(#_lgradient_19)"
							/>
						</g>
					</svg>
				</div>
			</div>
		</div>
		<?php
	}

	public function disable_emojis_tinymce( $plugins ) {
		return is_array( $plugins ) ? array_diff( $plugins, [ 'wpemoji' ] ) : [];
	}

	public function disable_admin_emojis() {
		// if(self::is_admin_page()) {
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' ); // Admin browser support detection script
		remove_action( 'admin_print_styles', 'print_emoji_styles' ); // Admin emoji styles

	}

}
