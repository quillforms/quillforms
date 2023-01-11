<?php
/**
 * Admin: class Admin
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Admin
 */

namespace QuillForms\Admin;

use QuillForms\Capabilities;
use QuillForms\Settings;

/**
 * QuillForms Admin
 *
 * @since 1.0.0
 */
class Admin {

	/**
	 * Class Instance.
	 *
	 * @var Admin
	 *
	 * @since 1.0.0
	 */
	private static $instance;

	/**
	 * Admin Instance.
	 *
	 * Instantiates or reuses an instance of Admin.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @see Admin()
	 *
	 * @return self - Single instance
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 * Since this is a singleton class, it is better to have its constructor as a private.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->admin_hooks();
		Capabilities::assign_capabilities_for_user_roles();
	}

	/**
	 * Admin Hooks.
	 *
	 * @since 1.0.0
	 */
	public function admin_hooks() {
		add_action( 'admin_menu', array( $this, 'create_admin_menu_pages' ) );
		add_action( 'wp_ajax_quillforms_duplicate_form', array( $this, 'duplicate_form' ) );
		add_action( 'pre_get_posts', array( $this, 'include_quill_forms_post_type_in_query' ), 11 );
		add_filter( 'post_type_link', array( $this, 'remove_cpt_slug'), 10, 3 );
	}

	/**
	 * Duplicate form
	 *
	 * @since 1.7.4
	 *
	 * @return integer|WP_Error|false
	 */
	public function duplicate_form() {
		$form_id = (int) $_POST['form_id'];
		$form    = get_post( $form_id );
		if ( ! $form ) {
			return false;
		}

		$new_form_id = wp_insert_post(
			array(
				'post_title'  => $form->post_title . ' copy',
				'post_status' => 'draft',
				'post_type'   => $form->post_type,
				'post_author' => $form->post_author,
			)
		);
		if ( is_wp_error( $new_form_id ) ) {
			return $new_form_id;
		}
		$form_meta = get_post_meta( $form_id );
		foreach ( $form_meta as $key => $values ) {
			foreach ( $values as $value ) {
				add_post_meta( $new_form_id, $key, maybe_unserialize( $value ) );
			}
		}

		wp_send_json_success( $new_form_id );
	}

	/**
	 * Create admin menu pages
	 *
	 * @since 1.0.0
	 */
	public function create_admin_menu_pages() {
		add_menu_page(
			__( 'Quill Forms', 'quillforms' ),
			__( 'Quill Forms', 'quillforms' ),
			'manage_quillforms',
			'quillforms',
			array( Admin_Loader::class, 'page_wrapper' ),
			'data:image/svg+xml;base64,' . base64_encode(
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
			30
		);
		// Add main page as a submenu page.
		add_submenu_page( 'quillforms', __( 'Quill Forms', 'quillforms' ), __( 'All Forms', 'quillforms' ), 'manage_quillforms', 'quillforms', array( Admin_Loader::class, 'page_wrapper' ) );

		// Add addons page as a submenu page.
		add_submenu_page( 'quillforms', __( 'Addons', 'quillforms' ), __( 'Addons', 'quillforms' ), 'manage_quillforms', 'quillforms&path=addons', array( Admin_Loader::class, 'page_wrapper' ) );

		// Add settings page as a submenu page.
		add_submenu_page( 'quillforms', __( 'Settings', 'quillforms' ), __( 'Settings', 'quillforms' ), 'manage_quillforms', 'quillforms&path=settings', array( Admin_Loader::class, 'page_wrapper' ) );

		// Add license page as a submenu page.
		add_submenu_page( 'quillforms', __( 'License', 'quillforms' ), __( 'License', 'quillforms' ), 'manage_quillforms', 'quillforms&path=license', array( Admin_Loader::class, 'page_wrapper' ) );

		// Add system page as a submenu page.
		add_submenu_page( 'quillforms', __( 'System', 'quillforms' ), __( 'System', 'quillforms' ), 'manage_quillforms', 'quillforms&path=system', array( Admin_Loader::class, 'page_wrapper' ) );

		// Add support page as a submenu page.
		add_submenu_page( 'quillforms', __( 'Support', 'quillforms' ), __( 'Support', 'quillforms' ), 'manage_quillforms', 'quillforms&path=support', array( Admin_Loader::class, 'page_wrapper' ) );
	}

	/**
	 * Include quill_forms in post type query if the slug is empty.
	 *
	 * @since 1.17.1
	 *
	 * @param object $query Query object.
	 * @return void
	 */
	public function include_quill_forms_post_type_in_query( $query ) {
		if ( Settings::get( 'override_quillforms_slug' ) && empty( Settings::get( 'quillforms_slug' ) ) ) {

			// Only noop the main query.
			if ( ! $query->is_main_query() ) {
				return;
			}

			// Only noop our very specific rewrite rule match.
			if (
				2 !== count( $query->query )
				|| ! isset( $query->query['page'] )
			) {
				return;
			}

			// Include my post type in the query.
			if ( ! empty( $query->query['name'] ) ) {
				$query->set( 'post_type', array( 'post', 'page', 'quill_forms' ) );
			}
		}

	}

	/**
	 * Remove CPT Slug
	 *
	 * @since 1.25.0
	 */
	public function remove_cpt_slug( $post_link, $post, $leavename ) {

		if ( 'quill_forms' !== $post->post_type || 'publish' !== $post->post_status || ! Settings::get( 'override_quillforms_slug' ) || ! empty( Settings::get( 'quillforms_slug' ) ) ) {

			return $post_link;
		}

		$post_link = str_replace( '/' . $post->post_type . '/', '/', $post_link );

		return $post_link;
	}

}
