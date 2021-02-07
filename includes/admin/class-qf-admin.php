<?php
/**
 * Admin: class QF_Admin
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Admin
 */
defined( 'ABSPATH' ) || exit;
/**
 * QuillForms Admin
 *
 * @since 1.0.0
 */
class QF_Admin {

	/**
	 * Class Instance.
	 *
	 * @var QF_Admin
	 *
	 * @since 1.0.0
	 */
	public static $instance;

	/**
	 * QuillForms_Admin Instance.
	 *
	 * Instantiates or reuses an instance of QuillForms_Admin.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @see QF_Admin()
	 *
	 * @return QF_Admin - Single instance
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new QF_Admin();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->admin_hooks();
	}

	/**
	 * Admin Hooks.
	 *
	 * @since 1.0.0
	 */
	public function admin_hooks() {
		add_action( 'admin_menu', array( $this, 'create_admin_menu_pages' ) );
		add_filter( 'quillforms_navigation_is_registered_page', array( $this, 'register_extra_admin_pages' ), 10, 2 );
	}

	/**
	 * Register Quill Forms Post Type.
	 *
	 * @since 1.0.0
	 */
	public function register_quillforms_post_type() {
		$labels   = array(
			'name'                  => __( 'Forms', 'quillforms' ),
			'singular_name'         => __( 'Form', 'quillforms' ),
			'add_new'               => __( 'Add Form', 'quillforms' ),
			'add_new_item'          => __( 'Add Form', 'quillforms' ),
			'edit_item'             => __( 'Edit Form', 'quillforms' ),
			'new_item'              => __( 'Add Form', 'quillforms' ),
			'view_item'             => __( 'View Form', 'quillforms' ),
			'search_items'          => __( 'Search Forms', 'quillforms' ),
			'not_found'             => __( 'No forms found', 'quillforms' ),
			'not_found_in_trash'    => __( 'No forms found in trash', 'quillforms' ),
			'featured_image'        => __( 'Form Featured Image', 'quillforms' ),
			'set_featured_image'    => __( 'Set featured image', 'quillforms' ),
			'remove_featured_image' => __( 'Remove featured image', 'quillforms' ),
			'use_featured_image'    => __( 'Use as featured image', 'quillforms' ),
		);
		$supports = array(
			'title',
			'thumbnail',
		);

		$args = array(
			'labels'             => $labels,
			'hierarchical'       => false,
			'supports'           => $supports,
			'public'             => true,
			'show_in_menu'       => false,
			'show_ui'            => true,
			'map_meta_cap'       => true,
			'publicly_queryable' => true,
			'query_var'          => true,
			'capability_type'    => 'quillform',
			'rewrite'            => array(
				'slug'       => 'quillforms',
				'feeds'      => true,
				'with_front' => false,
			),
			'has_archive'        => true,
			'menu_position'      => 30,
			'show_in_rest'       => true,
		);
		register_post_type( 'quill_forms', $args );
	}



	/**
	 * Create admin menu pages
	 *
	 * @since 1.0.0
	 */
	public function create_admin_menu_pages() {
		qf_admin_register_page(
			array(
				'id'       => 'quillforms',
				'title'    => __( 'Forms', 'quillforms' ),
				'path'     => 'quillforms',
				'icon'     => 'data:image/svg+xml;base64,' . base64_encode(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5219 5951" width="5519x" height="5519px">
						<style>
							tspan { white-space:pre }
							.shp0 { fill: none }
							.shp1 { fill: #a9abae; fill-rule:nonzero }
						</style>
						<g id="Layer_x0020_1">
							<g id="_2145120152032">
								<path id="Layer" class="shp0" d="M-708 -570L6202 -570L6202 6340L-708 6340L-708 -570Z" />
								<path id="Layer" fill-rule="evenodd" class="shp1" d="M5389 6034C5082 5453 4522 4864 3980 4864C2595 4864 1968 4388 1968 4388C2880 4601 3117 4249 3117 4249C1133 4435 1031 3090 1031 3090C1223 3566 1697 3712 1697 3712C680 2439 1516 1417 1516 1417C1114 2717 2010 3609 3233 3947C4604 4359 5163 5282 5389 6034ZM2162 91C2326 58 2496 40 2670 40C4086 40 5234 1188 5234 2604C5234 3047 5135 3451 4903 3885C4994 4133 5077 4398 5128 4724C5128 4724 4859 4033 4496 3694C4657 3406 4750 3074 4750 2721C4750 1618 3856 724 2753 724C2362 724 1996 839 1686 1035C1123 1392 748 2019 755 2721C770 4038 1718 4582 2182 4791C2463 4911 2836 5035 3456 5045C3208 5125 2944 5169 2670 5169C1254 5169 106 4021 106 2604C106 1362 989 326 2162 91ZM3346 2698C3346 2698 3457 3145 4367 3905C4974 4412 5267 5449 5267 5449C4515 4025 3802 4052 2630 3530C1168 2878 1628 1274 1628 1274C1628 1274 1814 2597 2479 2942C2479 2942 2352 2497 2491 2056C2491 2056 2499 2895 3450 3452C3450 3452 3195 3042 3346 2698Z" />
							</g>
						</g>
					</svg>'
				),
				'position' => 30,
			)
		);
	}

	/**
	 * Register extra admin pages, those admin pages don't appear in admin menu or aren't be registered with add_menu_page or add_submenu_page
	 *
	 * @since 1.0.0
	 *
	 * @param bool   $is_registered   Is this page registered.
	 * @param string $current_page    The current page.
	 *
	 * @return bool $is_registered
	 */
	public function register_extra_admin_pages( $is_registered, $current_page ) {
		$screen = get_current_screen();
		if ( 'toplevel_page_quillforms' === $screen->id ) {
			if ( ! empty( $_GET['path'] ) && preg_match( '/forms\/([0-9]+)\/(.*?)$/', $_GET['path'] ) ) {
				return true;
			}
		}
		return $is_registered;
	}

}
