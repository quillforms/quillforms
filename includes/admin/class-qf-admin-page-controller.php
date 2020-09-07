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
	 * Contains information (breadcrumbs, menu info) about JS powered pages and classic WooCommerce pages.
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
		 * Used to determine if this is a JS-powered WooCommerce Admin page.
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
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Current page retrieval should be called on or after the `current_screen` hook.', 'woocommerce-admin' ), '0.16.0' );
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
	 *   @type string      id           Id to reference the page.
	 *   @type string      title        Page title. Used in menus and breadcrumbs.
	 *   @type string|null parent       Parent ID. Null for new top level page.
	 *   @type string      path         Path for this page, full path in app context; ex /analytics/report
	 *   @type string      capability   Capability needed to access the page.
	 *   @type string      icon         Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
	 *   @type int         position     Menu item position.
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
		?>
		<div class="wrap">
			<div id="qf-admin-root"></div>
		</div>
		<?php
	}
}
