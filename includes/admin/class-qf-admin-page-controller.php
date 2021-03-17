<?php
/**
 * Admin: class QF_Admin_Page_Controller
 *
 * @package QuillForms
 * @subpackage Admin
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * PageController
 */
class QF_Admin_Page_Controller {
	// JS-powered page root.
	const PAGE_ROOT = 'quillforms';

	/**
	 * Singleton instance of self.
	 *
	 * @var QF_Admin_Page_Controller
	 */
	private static $instance = false;

	/**
	 * Current page ID (or false if not registered with this controller).
	 *
	 * @var string
	 */
	private $current_page = null;

	/**
	 * Registered pages
	 * Contains information  about JS powered pages and classic QuillForms pages.
	 *
	 * @var array
	 */
	private $pages = array();

	/**
	 * Singleton class
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Connect an existing page to wc-admin.
	 *
	 * @param array $options {
	 *   Array describing the page.
	 *
	 *   @type string       id           Id to reference the page.
	 *   @type string|array title        Page title. Used in menus and breadcrumbs.
	 *   @type string|null  parent       Parent ID. Null for new top level page.
	 *   @type string       path         Path for this page. E.g. admin.php?page=wc-settings&tab=checkout
	 *   @type string       capability   Capability needed to access the page.
	 *   @type string       icon         Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
	 *   @type int          position     Menu item position.
	 *   @type boolean      js_page      If this is a JS-powered page.
	 * }
	 */
	public function connect_page( $options ) {
		if ( ! is_array( $options['title'] ) ) {
			$options['title'] = array( $options['title'] );
		}

		/**
		 * Filter the options when connecting or registering a page.
		 *
		 * Use the `js_page` option to determine if registering.
		 *
		 * @param array $options {
		 *   Array describing the page.
		 *
		 *   @type string       id           Id to reference the page.
		 *   @type string|array title        Page title. Used in menus and breadcrumbs.
		 *   @type string|null  parent       Parent ID. Null for new top level page.
		 *   @type string       screen_id    The screen ID that represents the connected page. (Not required for registering).
		 *   @type string       path         Path for this page. E.g. admin.php?page=wc-settings&tab=checkout
		 *   @type string       capability   Capability needed to access the page.
		 *   @type string       icon         Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
		 *   @type int          position     Menu item position.
		 *   @type boolean      js_page      If this is a JS-powered page.
		 * }
		 */
		$options = apply_filters( 'quillforms_navigation_connect_page_options', $options );

		// @todo check for null ID, or collision.
		$this->pages[ $options['id'] ] = $options;
	}

		/**
		 * Returns true if we are on a page registed with this controller.
		 *
		 * @return boolean
		 */
	public function is_registered_page() {
		$current_page = $this->get_current_page();

		if ( false === $current_page ) {
			$is_registered_page = false;
		} else {
			$is_registered_page = isset( $current_page['js_page'] ) && $current_page['js_page'];
		}

		/**
		 * Whether or not the current page was registered with this controller.
		 *
		 * Used to determine if this is a JS-powered QuillForms Admin page.
		 *
		 * @param boolean       $is_registered_page True if the current page was registered with this controller.
		 * @param array|boolean $current_page The registered page data or false if not identified.
		 */
		return apply_filters( 'quillforms_navigation_is_registered_page', $is_registered_page, $current_page );
	}

	/**
	 * Get the current page.
	 *
	 * @return array|boolean Current page or false if not registered with this controller.
	 */
	public function get_current_page() {
		// If 'current_screen' hasn't fired yet, the current page calculation
		// will fail which causes `false` to be returned for all subsquent calls.
		if ( ! did_action( 'current_screen' ) ) {
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Current page retrieval should be called on or after the `current_screen` hook.', 'quillforms' ), '0.16.0' );
		}

		if ( is_null( $this->current_page ) ) {
			$this->determine_current_page();
		}

		return $this->current_page;
	}

	/**
	 * Determine the current page ID, if it was registered with this controller.
	 */
	public function determine_current_page() {
		$current_url       = '';
		$current_screen_id = $this->get_current_screen_id();

		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$current_url = esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) );
		}

		$current_query = wp_parse_url( $current_url, PHP_URL_QUERY );
		parse_str( $current_query, $current_pieces );
		$current_path  = empty( $current_pieces['page'] ) ? '' : $current_pieces['page'];
		$current_path .= empty( $current_pieces['path'] ) ? '' : '&path=' . $current_pieces['path'];

		foreach ( $this->pages as $page ) {
			if ( isset( $page['js_page'] ) && $page['js_page'] ) {
				// Check registered admin pages.
				if (
					$page['path'] === $current_path
				) {
					$this->current_page = $page;
					return;
				}
			} else {
				// Check connected admin pages.
				if (
					isset( $page['screen_id'] ) &&
					$page['screen_id'] === $current_screen_id
				) {
					$this->current_page = $page;
					return;
				}
			}
		}

		$this->current_page = false;
	}

	/**
	 * Returns the current screen ID.
	 *
	 * @return string Current screen ID.
	 */
	public function get_current_screen_id() {
		$current_screen = get_current_screen();
		if ( ! $current_screen ) {
			// Filter documentation below.
			return apply_filters( 'quillforms_navigation_current_screen_id', false, $current_screen );
		}
	}



	/**
	 * Returns the path from an ID.
	 *
	 * @param  string $id  ID to get path for.
	 * @return string Path for the given ID, or the ID on lookup miss.
	 */
	public function get_path_from_id( $id ) {
		if ( isset( $this->pages[ $id ] ) && isset( $this->pages[ $id ]['path'] ) ) {
			return $this->pages[ $id ]['path'];
		}
		return $id;
	}

	/**
	 * Adds a JS powered page to qf-admin.
	 *
	 * @param array $options {
	 *   Array describing the page.
	 *
	 *   @type string      id                     Id to reference the page.
	 *   @type string      title                  Page title. Used in menus and breadcrumbs.
	 *   @type string|null parent                 Parent ID. Null for new top level page.
	 *   @type string      path                   Path for this page, full path in app context; ex /analytics/report
	 *   @type string      capability             Capability needed to access the page.
	 *   @type string      icon                   Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
	 *   @type int         position               Menu item position.
	 * }
	 */
	public function register_page( $options ) {
		$defaults = array(
			'id'         => null,
			'parent'     => null,
			'title'      => '',
			'capability' => 'manage_quillforms',
			'path'       => '',
			'icon'       => '',
			'position'   => null,
			'js_page'    => true,
		);

		$options = wp_parse_args( $options, $defaults );

		if ( 0 !== strpos( $options['path'], self::PAGE_ROOT ) ) {
			$options['path'] = self::PAGE_ROOT . '&path=' . $options['path'];
		}
		if ( is_null( $options['parent'] ) ) {
			add_menu_page(
				$options['title'],
				$options['title'],
				$options['capability'],
				$options['path'],
				array( __CLASS__, 'page_wrapper' ),
				$options['icon'],
				$options['position']
			);
		} else {
			$parent_path = $this->get_path_from_id( $options['parent'] );
			// @todo check for null path.
			add_submenu_page(
				$parent_path,
				$options['title'],
				$options['title'],
				$options['capability'],
				$options['path'],
				array( __CLASS__, 'page_wrapper' )
			);
		}

		$this->connect_page( $options );
	}

	/**
	 * Set up a div for the app to render into.
	 */
	public static function page_wrapper() {
		wp_enqueue_script( 'quillforms-client' );
		wp_enqueue_style( 'quillforms-client' );
		wp_enqueue_style( 'quillforms-builder-core' );
		foreach ( QF_Blocks_Factory::get_instance()->get_all_registered() as $block ) {
			wp_enqueue_script( $block->get_block_scripts()['admin'] );
			wp_enqueue_script( $block->get_block_scripts()['renderer'] );
			wp_enqueue_style( $block->get_block_styles()['admin'] );
			wp_enqueue_style( $block->get_block_styles()['renderer'] );
		}
		?>
		<div class="wrap">
			<script src="<?php echo QF_PLUGIN_URL . 'includes/admin/bodymovin.js'; ?>" type="text/javascript"></script>

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
}
