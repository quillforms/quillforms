<?php
/**
 * Class: Store
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

use Throwable;

/**
 * Store Class
 *
 * @since 1.6.0
 */
class Store {

	/**
	 * Addons
	 *
	 * @var array
	 */
	private $addons;

	/**
	 * Class instance
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.6.0
	 */
	private function __construct() {
		$this->define_addons();

		add_action( 'wp_ajax_quillforms_addon_activate', array( $this, 'ajax_activate' ) );
	}

	/**
	 * Get all addons
	 *
	 * @param boolean $include_plugin_file Whether to include plugin_file & full_plugin_file or not.
	 * @return array
	 */
	public function get_all_addons( $include_plugin_file = false ) {
		if ( $include_plugin_file ) {
			$exclude = array();
		} else {
			$exclude = array( 'plugin_file', 'full_plugin_file' );
		}
		return array_map(
			function( $addon ) use ( $exclude ) {
				return array_filter(
					$addon,
					function( $addon_property ) use ( $exclude ) {
						return ! in_array( $addon_property, $exclude, true );
					},
					ARRAY_FILTER_USE_KEY
				);
			},
			$this->addons
		);
	}

	/**
	 * Activate addon
	 *
	 * @param string $addon_slug Addon slug.
	 * @return array
	 */
	public function activate( $addon_slug ) {
		$plugin_file = $this->addons[ $addon_slug ]['plugin_file'];

		if ( ! function_exists( 'activate_plugin' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// try to activate.
		try {
			$result = activate_plugin( $plugin_file );
			if ( is_wp_error( $result ) ) {
				quillforms_get_logger()->error(
					esc_html__( 'Unexpected output on activating the addon plugin', 'quillforms' ),
					array(
						'code'  => 'addon_activation_unexpected_output',
						'error' => array(
							'code'    => $result->get_error_code(),
							'message' => $result->get_error_message(),
							'data'    => $result->get_error_data(),
						),
					)
				);
			}
		} catch ( Throwable $e ) {
			quillforms_get_logger()->error(
				esc_html__( 'Fatal error on activating the addon plugin', 'quillforms' ),
				array(
					'code'      => 'addon_activation_fatal_error',
					'exception' => array(
						'code'    => $e->getCode(),
						'message' => $e->getMessage(),
						'trace'   => $e->getTraceAsString(),
					),
				)
			);
		}

		$is_activated = is_plugin_active( $plugin_file );
		return array(
			'success' => $is_activated,
		);
	}

	/**
	 * Ajax handler for activating addon
	 *
	 * @return mixed
	 */
	public function ajax_activate() {
		$this->check_authorization();

		// posted addon slug.
		$addon_slug = trim( $_POST['addon'] ?? '' );
		if ( empty( $addon_slug ) ) {
			wp_send_json_error( esc_html__( 'Addon slug is required', 'quillforms' ), 400 );
			exit;
		}

		// check addon existence.
		if ( ! isset( $this->addons[ $addon_slug ] ) ) {
			wp_send_json_error( esc_html__( 'Cannot find the addon', 'quillforms' ), 400 );
			exit;
		}

		$result = $this->activate( $addon_slug );
		if ( $result['success'] ) {
			wp_send_json_success( esc_html__( 'Addon plugin activated successfully', 'quillforms' ), 200 );
		} else {
			wp_send_json_error( $result['message'] ?? esc_html__( 'Cannot activate the addon plugin, please check the log for details', 'quillforms' ), 422 );
		}
		exit;
	}

	/**
	 * Initialize addons
	 *
	 * @return void
	 */
	private function define_addons() {
		$addons = array(
			'entries'         => array(
				'name'           => esc_html__( 'Entries Addon', 'quillforms' ),
				'description'    => esc_html__( 'Store, view, manage and export entries', 'quillforms' ),
				'plugin_file'    => 'QuillForms-Entries/quillforms-entries.php',
				'plan'           => 'basic',
				'is_integration' => false,
			),
			'logic'           => array(
				'name'           => esc_html__( 'Logic Addon', 'quillforms' ),
				'description'    => esc_html__( 'Jump logic and calculator', 'quillforms' ),
				'plugin_file'    => 'QuillForms-Logic/quillforms-logic.php',
				'plan'           => 'basic',
				'is_integration' => false,
			),
			'fileblock'       => array(
				'name'           => esc_html__( 'File Block Addon', 'quillforms' ),
				'description'    => esc_html__( 'Enable users to upload files', 'quillforms' ),
				'plugin_file'    => 'QuillForms-FileBlock/quillforms-fileblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
			),
			'constantcontact' => array(
				'name'           => esc_html__( 'Constant Contact Addon', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your Constant Contact lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-ConstantContact/quillforms-constantcontact.php',
				'plan'           => 'basic',
				'is_integration' => true,
			),
			'mailchimp'       => array(
				'name'           => esc_html__( 'MailChimp Addon', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your MailChimp lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-MailChimp/quillforms-mailchimp.php',
				'plan'           => 'basic',
				'is_integration' => true,
			),
			'getresponse'     => array(
				'name'           => esc_html__( 'GetResponse Addon', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your GetResponse lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-GetResponse/quillforms-getresponse.php',
				'plan'           => 'basic',
				'is_integration' => true,
			),
			'googlesheets'    => array(
				'name'           => esc_html__( 'GoogleSheets Addon', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your GoogleSheets lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-GoogleSheets/quillforms-googlesheets.php',
				'plan'           => 'basic',
				'is_integration' => true,
			),
		);

		if ( ! function_exists( 'is_plugin_active' ) || ! function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		foreach ( $addons as $slug => $addon ) {
			$full_plugin_file = WP_PLUGIN_DIR . '/' . $addon['plugin_file'];
			$plugin_exists    = file_exists( $full_plugin_file );
			$plugin_data      = $plugin_exists ? get_plugin_data( $full_plugin_file ) : array();

			$addons[ $slug ]['full_plugin_file'] = $full_plugin_file;
			$addons[ $slug ]['is_installed']     = $plugin_exists;
			$addons[ $slug ]['is_active']        = is_plugin_active( $addon['plugin_file'] );
			$addons[ $slug ]['version']          = $plugin_data['Version'] ?? null;
		}

		$this->addons = $addons;
	}

	/**
	 * Check ajax request authorization.
	 * Sends error response and exit if not authorized.
	 *
	 * @return void
	 */
	private function check_authorization() {
		// check for valid nonce field.
		if ( ! check_ajax_referer( 'quillforms_site_store', '_nonce', false ) ) {
			wp_send_json_error( esc_html__( 'Invalid nonce', 'quillforms' ), 403 );
			exit;
		}

		// check for user capability.
		if ( ! current_user_can( 'manage_quillforms' ) ) {
			wp_send_json_error( esc_html__( 'Forbidden', 'quillforms' ), 403 );
			exit;
		}
	}

}
