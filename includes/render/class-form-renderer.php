<?php
/**
 * Form Renderer: Form_Renderer class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

namespace QuillForms\Render;

use QuillForms\Client_Messages;
use QuillForms\Core;
use QuillForms\Fonts;
use QuillForms\Form_Submission;
use QuillForms\Managers\Blocks_Manager;
use QuillForms\Models\Form_Theme_Model;

/**
 * Class Form_Renderer is responsible for overriding single post page with the renderer template and enqueuing assets.
 *
 * @since 1.0.0
 */
class Form_Renderer {

	/**
	 * Form id
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	private $form_id = null;

	/**
	 * Form object
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private $form_object = null;

	/**
	 * Is renderer overrided
	 *
	 * @since 1.19.0
	 *
	 * @var boolean
	 */
	private $overrided = false;

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var Form_Renderer|null
	 */
	private static $instance = null;


	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return Form_Render the main instance
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function __construct() {
		$this->init();
	}

	/**
	 * Init method to initialize some hooks.
	 *
	 * @since 1.0.0
	 */
	public function init() {
		add_action( 'wp', array( $this, 'check_override' ) );

		// Overriding single post page with custom template.
		add_action( 'init', array( $this, 'template_include' ) );

		add_filter( 'show_admin_bar', array( $this, 'hide_admin_bar' ) );

		// Enqueuing assets to make the form render properly.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ), 9999999 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_render_script' ), 99999999 );

		// Remove any defer/async before printing script tags.
		add_filter( 'script_loader_tag', array( $this, 'remove_script_defer' ), PHP_INT_MAX, 3 );
	}

	/**
	 * Check if renderer class overrided.
	 *
	 * @since 1.19.0
	 *
	 * @return void
	 */
	public function check_override() {
		$this->overrided = apply_filters( 'quillforms_form_renderer_overrided', false );
	}

	/**
	 * Our custom template to override single post page.
	 *
	 * @since 1.0.0
	 */
	public function template_include() {
		add_filter( 'template_include', array( $this, 'template_loader' ), 999999 );
	}


	/**
	 * Do not cache.
	 *
	 * Tell WordPress cache plugins not to cache this request.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function do_not_cache() {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}

		if ( ! defined( 'DONOTCACHEDB' ) ) {
			define( 'DONOTCACHEDB', true );
		}

		if ( ! defined( 'DONOTMINIFY' ) ) {
			define( 'DONOTMINIFY', true );
		}

		if ( ! defined( 'DONOTCDN' ) ) {
			define( 'DONOTCDN', true );
		}

		if ( ! defined( 'DONOTCACHCEOBJECT' ) ) {
			define( 'DONOTCACHCEOBJECT', true );
		}

		// WP Rocket.
		if ( ! defined( 'DONOTROCKETOPTIMIZE' ) ) {
			define( 'DONOTROCKETOPTIMIZE', true );
		}

		// WP Fastest cache.
		if ( function_exists( 'wpfc_exclude_current_page' ) ) {
			wpfc_exclude_current_page();
		}
	}

	/**
	 * Load the template.
	 *
	 * @since 1.0.0
	 *
	 * @param string $template The template path.
	 *
	 * @return string The modified template
	 */
	public function template_loader( $template ) {
		if ( is_singular( 'quill_forms' ) && ! $this->overrided ) {
			$this->do_not_cache();
			$this->set_form_id( get_the_ID() );
			return QUILLFORMS_PLUGIN_DIR . '/includes/render/renderer-template.php';
		}
		return $template;
	}


	/**
	 * Set form id.
	 * private function because it shouldn't be public.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param int $form_id The form id.
	 */
	private function set_form_id( int $form_id ) {
		$this->form_id = $form_id;
	}

	/**
	 * Prepare form object to send it as a prop to FormRender component.
	 *
	 * @since 1.0.0
	 *
	 * @return array The form object.
	 */
	public function prepare_form_object() {
		// if form_id property isn't set, do nothing.
		if ( ! $this->form_id ) {
			return;
		}
		if ( ! $this->form_object ) {
			$this->form_object = apply_filters(
				'quillforms_renderer_form_object',
				array(
					'blocks'     => Core::get_blocks( $this->form_id ),
					'messages'   => array_merge(
						array_map(
							function ( $value ) {
								return $value['default'];
							},
							Client_Messages::instance()->get_messages()
						),
						Core::get_messages( $this->form_id )
					),
					'theme'      => Core::get_theme( $this->form_id ),
					'themesList' => Form_Theme_Model::get_all_registered_themes(),
					'settings'   => Core::get_form_settings( $this->form_id ),
					'customCSS'  => get_post_meta( $this->form_id, 'customCSS', true ) ?? "",
				),
				$this->form_id
			);
		}
		return $this->form_object;
	}

	/**
	 * Enqueue necessary assets to make the form work properly with React.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_assets() {
		if ( is_singular( 'quill_forms' ) && ! $this->overrided ) :
			global $wp_scripts;
			global $wp_styles;
			global $post;
			Core::register_block_types_by_js();
			Core::set_renderer_config();

			$form_id           = $post->ID;
			$wp_scripts->queue = array( 'quillforms-renderer-core' );
			$wp_styles->queue  = array( 'quillforms-renderer-core' );

			$blocks = Core::get_blocks( $form_id );

			$all_blocks = Core::get_blocks_recursively($blocks);
			// Render styles for used blocks only.
			foreach ( $all_blocks as $block ) {
				$block_type = Blocks_Manager::instance()->get_registered( $block['name'] );
				if ( ! empty( $block_type ) && ! empty( $block_type->block_renderer_assets['style'] ) ) {
					$wp_styles->queue[] = $block_type->block_renderer_assets['style'];
				}
			}

			// Render scripts for used blocks only.
			foreach ( $all_blocks as $block ) {
				$block_type = Blocks_Manager::instance()->get_registered( $block['name'] );
				if ( ! empty( $block_type ) && ! empty( $block_type->block_renderer_assets['script'] ) ) {
					$wp_scripts->queue[] = $block_type->block_renderer_assets['script'];
				}
			}

			// Loading font.
			$form_object = $this->prepare_form_object();
			if ( $form_object ) {
				$theme = $form_object['theme'];

				$font      = esc_attr( $theme['font'] );
				$font_type = Fonts::get_font_type( $font );
				$font_url  = null;
				switch ( $font_type ) {
					case 'googlefonts':
						$font_url =
							'https://fonts.googleapis.com/css?family=' .
							$font .
							':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

						break;

					case 'earlyaccess':
						$font_lower_case = strtolower( $font );
						$font_url        =
							'https://fonts.googleapis.com/earlyaccess/' + $font_lower_case + '.css';
						break;
				}
				if ( $font_url ) {
					// Enqueue font url, it is important to generate a random id every time this font enqueud because it is dynamic
					// and we don't want it to be cached by any way.
					wp_enqueue_style( 'quillforms-renderer-load-font', esc_url( $font_url ), array(), uniqid() );
				}
			}

		endif;
	}

	/**
	 * Enqueue render.js script
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function enqueue_render_script() {
		if ( is_singular( 'quill_forms' ) && ! $this->overrided ) :
			global $post;
			$form_id     = $post->ID;
			$form_object = $this->prepare_form_object();

			wp_enqueue_script(
				'quillforms-react-renderer-script',
				QUILLFORMS_PLUGIN_URL . 'includes/render/render.js',
				array( 'quillforms-renderer-core' ),
				QUILLFORMS_VERSION,
				true
			);

			wp_localize_script(
				'quillforms-react-renderer-script',
				'qfRender',
				array(
					'ajaxurl'    => admin_url( 'admin-ajax.php' ),
					'formObject' => $form_object,
					'formId'     => $form_id,
				)
			);

			$submission_id = $_GET['submission_id'] ?? null;
			$step          = $_GET['step'] ?? null;
			if ( $submission_id && 'payment' === $step ) {
				$form_submission = Form_Submission::instance();
				$restore         = $form_submission->restore_pending_submission( $submission_id );
				if ( $restore ) {
					wp_localize_script(
						'quillforms-react-renderer-script',
						'pending_submission',
						$form_submission->get_pending_submission_renderer_data()
					);
				}
			}

		endif;
	}

	/**
	 * Hide admin bar in form pages
	 *
	 * @since 1.0.0
	 *
	 * @param boolean $show_admin_bar Whether the admin bar should be shown.
	 * @return boolean
	 */
	public function hide_admin_bar( $show_admin_bar ) {
		if ( is_singular( 'quill_forms' ) ) {
			return false;
		}

		return $show_admin_bar;
	}

	/**
	 * Remove any async/defer from scripts
	 *
	 * @since 1.13.1
	 *
	 * @param string $tag    The `<script>` tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 * @return string
	 */
	public function remove_script_defer( $tag, $handle, $src ) 	{ // phpcs:ignore
		if ( is_singular( 'quill_forms' ) ) {
			$tag = preg_replace( '/(async|defer)=?[\'"\w]*/i', '', $tag );
		}

		return $tag;
	}

}
