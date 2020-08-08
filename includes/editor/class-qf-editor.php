<?php
/**
 * Editor: class QF_Editor
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Editor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * QF_Editor class is responsible for rendering the editor with scripts and styles.
 */
class QF_Editor {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_action_quillforms', array( $this, 'init' ) );
	}

	public function init() {
		if ( empty( $_REQUEST['form_id'] ) ) {
			return;
		}

		$this->_form_id = absint( $_REQUEST['form_id'] );

		if ( ! QF_User::is_current_user_can_edit( $this->_form_id ) ) {
			return;
		}

		// Send MIME Type header like WP admin-header.
		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

		add_action( 'init', array( $this, 'disable_wp_emojicons' ) );

		add_filter( 'show_admin_bar', '__return_false' );

		// Remove all WordPress actions.
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );
		remove_all_actions( 'wp_footer' );

		// Handle `wp_head`.
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );
		add_action( 'wp_head', 'wp_site_icon' );

		// Handle `wp_footer`.
		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );
		// add_action('wp_footer', 'wp_auth_check_html', 30);
		// add_action('wp_footer', [$this, 'wp_footer']);

		// Handle `wp_enqueue_scripts`.
		remove_all_actions( 'wp_enqueue_scripts' );

		// // Also remove all scripts hooked into after_wp_tiny_mce.
		remove_all_actions( 'after_wp_tiny_mce' );

		// add_action('wp_enqueue_scripts', 'quillforms_register_scripts_and_styles', 5);
		// add_action('admin_enqueue_scripts', 'quillforms_register_scripts_and_styles', 5);
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 999999 );
		// add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);

		// Tell to WP Cache plugins do not cache this request.
		QF_Utils::do_not_cache();
		$this->render_editor_template();
	}

	/**
	 * Enqueue scripts.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		// Server side blocks registration.
		wp_add_inline_script(
			'quillforms-blocks',
			'qf.blocks.__unstableServerSideBlocksRegister(' . wp_json_encode(
				array_map(
					function ( $block ) {
						return array(
							'id'         => QF_Utils::generate_uuidv4(),
							'name'       => $block->get_name(),
							'attributes' => $block->prepare_attributes_for_render( $block->get_attributes() ),
							'supports'   => $block->get_supports(),
						);
					},
					QF_Blocks_Factory::get_instance()->get_all_registered()
				)
			) . ')',
			'after'
		);

		// Setup editor store.
		wp_add_inline_script(
			'quillforms-builder-core',
			'wp.data.dispatch("quillForms/builder-core").setupStore(' . wp_json_encode( QF_Form_Model::get_form_structure( $this->_form_id ) ) . ')',
			'after'
		);

		// Setup messages store.
		wp_add_inline_script(
			'quillforms-messages-editor',
			'wp.data.dispatch("quillForms/messages-editor").setupStore(' . wp_json_encode( QF_Form_Model::get_form_messages( $this->_form_id ) ) . ')',
			'after'
		);

		// Setup theme store.
		wp_add_inline_script(
			'quillforms-theme-editor',
			'wp.data.dispatch("quillForms/theme-editor").setupStore(' . wp_json_encode(
				array(
					'currentTheme'   => QF_Form_Model::get_form_theme_data( $this->_form_id ),
					'currentThemeId' => QF_Form_Model::get_form_theme_id( $this->_form_id ),
					'myThemes'       => QF_Form_Theme_Model::get_all_registered_themes( $this->_form_id ),
				)
			) . ')',
			'after'
		);

		// Setup Notitifications store.
		// wp_add_inline_script(
		// 'quillforms-notificationsEditor',
		// 'wp.data.dispatch("quillForms/notifications-core").setupStore(' . QF_Form_Model::get_form_structure( $this->_form_id ) . ')',
		// 'after'
		// );

		// Register server side blocks.
		wp_add_inline_script( 'wp-element', 'window.qfEditorContext = ' . wp_json_encode( qf_get_editor_context_value() ), 'before' );

		wp_enqueue_media();
		// wp_enqueue_script( 'wp-auth-check' );
	}

	public function enqueue_styles() {

		global $wp_version;
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		wp_enqueue_style( 'quillforms-builder-core' );
		wp_enqueue_style(
			'media',
			admin_url( '/css/media' . $suffix . '.css' ),
			array(),
			$wp_version
		);
		wp_enqueue_style( 'wp-auth-check' );
	}

	/**
	 * Disable WP Emoji Icons.
	 *
	 * @since 1.0.0
	 */
	public function disable_wp_emojicons() {
		// all actions related to emojis.
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

		// filter to remove TinyMCE emojis.
		add_filter( 'tiny_mce_plugins', array( $this, 'disable_emojicons_tinymce' ) );
	}

	/**
	 * Disable Emoji Icons TinyMCE.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $plugins The plugins.
	 */
	public function disable_emojicons_tinymce( $plugins ) {
		if ( is_array( $plugins ) ) {
			return array_diff( $plugins, array( 'wpemoji' ) );
		} else {
			return array();
		}
	}

	/**
	 * Render Editor Template.
	 *
	 * @since 1.0.0
	 */
	public function render_editor_template() {
		require_once 'editor-wrapper.php';
		die;
	}
}
