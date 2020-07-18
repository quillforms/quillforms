<?php
/**
 * Admin: class QF_Admin
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Admin
 */

use QuillForms\includes\Editor\Editor;

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
		require_once QF_PLUGIN_DIR . '/includes/editor/editor.php';
		$this->admin_hooks();
		$this->editor = new QF_Editor();
	}

	/**
	 * Admin Hooks.
	 *
	 * @since 1.0.0
	 */
	public function admin_hooks() {
		add_action( 'init', array( $this, 'register_quillforms_post_type' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ), 999999 );
		add_action( 'edit_form_after_title', array( $this, 'add_quill_builder_btn' ) );
		add_action( 'admin_init', array( $this, 'add_theme_caps' ) );
	}

	/**
	 * Register Quill Forms Post Type.
	 *
	 * @since 1.0.0
	 */
	public function register_quillforms_post_type() {
		$labels   = array(
			'name'                  => __( 'Quill Forms', 'quillforms' ),
			'singular_name'         => __( 'Quill Form', 'quillforms' ),
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
		$args     = array(
			'labels'        => $labels,
			'hierarchical'  => false,
			'supports'      => $supports,
			'public'        => true,
			'menu_icon'     => 'data:image/svg+xml;base64,' . base64_encode(
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
			'capabilities'  => array(
				'edit_post'          => 'edit_quill_form',
				'edit_posts'         => 'edit_quill_forms',
				'edit_others_posts'  => 'edit_other_quill_forms',
				'publish_posts'      => 'publish_quill_forms',
				'read_post'          => 'read_quill_forms',
				'read_private_posts' => 'read_private_quill_forms',
				'delete_post'        => 'delete_quill_form',
			),
			// Adding map_meta_cap will map the meta correctly.
			'map_meta_cap'  => true,
			'rewrite'       => array( 'slug' => 'quillforms' ),
			'has_archive'   => true,
			'menu_position' => 30,
		);
		register_post_type( 'quill_forms', $args );
	}

	/**
	 * Enqueue Admin styles.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( 'quillForms-admin-css', QF_PLUGIN_URL . 'admin/assets/admin.css', false, '', 'all' );
	}

	/**
	 * Add Quill Builder Button.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post $post Post object.
	 */
	public function add_quill_builder_btn( $post ) {
		$edit_url = add_query_arg(
			array(
				'form_id' => $post->ID,
				'action'  => 'quillforms',
			),
			admin_url( 'post.php' )
		);

		ob_start(); ?>
		<div class="quill__builderBtnWrapper">
			<a class="quill__builderBtn" href="<?php echo $edit_url; ?>">
				Start Building your form!
			</a>
		</div>
		<?php
		echo ob_get_clean();
	}

	/**
	 * Add Theme Caps.
	 *
	 * @since 1.0.0
	 */
	public function add_theme_caps() {
		$admins = get_role( 'administrator' );
		$admins->add_cap( 'edit_quill_form' );
		$admins->add_cap( 'edit_quill_forms' );
		$admins->add_cap( 'edit_other_quill_forms' );
		$admins->add_cap( 'publish_quill_forms' );
		$admins->add_cap( 'read_quill_form' );
		$admins->add_cap( 'read_private_quill_forms' );
		$admins->add_cap( 'delete_quill_form' );
	}
}
