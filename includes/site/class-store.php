<?php
/**
 * Class: Store
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

use Automatic_Upgrader_Skin;
use Plugin_Upgrader;
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

		add_action( 'wp_ajax_quillforms_addon_install', array( $this, 'ajax_install' ) );
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
	 * Get addon
	 *
	 * @since 1.6.0
	 *
	 * @param string $slug Addon slug.
	 * @return array|null
	 */
	public function get_addon( $slug ) {
		return $this->addons[ $slug ] ?? null;
	}

	/**
	 * Install addon
	 *
	 * @param string $addon_slug Addon slug.
	 * @return array
	 */
	public function install( $addon_slug ) {
		// check addon.
		if ( ! isset( $this->addons[ $addon_slug ] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot find addon', 'quillforms' ),
			);
		}

		// check if already installed.
		if ( $this->addons[ $addon_slug ]['is_installed'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Addon is already installed', 'quillforms' ),
			);
		}

		// check current license.
		$license = get_option( 'quillforms_license' );
		if ( ! $license ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'No license found', 'quillforms' ),
			);
		}
		if ( ! License::instance()->is_plan_accessible( $license['plan'], $this->addons[ $addon_slug ]['plan'] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Please upgrade your plan to install this addon', 'quillforms' ),
			);
		}

		// get plugin data with download link.
		$plugin_data   = Site::instance()->api_request(
			array(
				'edd_action'         => 'get_version',
				'license'            => $license['key'],
				'item_id'            => "{$addon_slug}_addon",
				'quillforms_version' => QUILLFORMS_VERSION,
			)
		);
		$download_link = $plugin_data['data']['download_link'] ?? null;
		if ( empty( $download_link ) ) {
			quillforms_get_logger()->debug(
				esc_html__( 'Cannot get addon info', 'quillforms' ),
				array(
					'code'       => 'cannot_get_addon_info',
					'addon_slug' => $addon_slug,
					'response'   => $plugin_data,
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot get addon info, please check your license', 'quillforms' ),
			);
		}

		// init plugin upgrader.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		$installer_skin = new Automatic_Upgrader_Skin();
		$installer      = new Plugin_Upgrader( $installer_skin );

		// check file system permissions.
		$filesystem_access = $installer_skin->request_filesystem_credentials();
		if ( ! $filesystem_access ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon automatically, please download it and install it manually', 'quillforms' ),
			);
		}

		// install the addon plugin.
		$installer->install( $download_link );

		// check wp_error.
		if ( is_wp_error( $installer_skin->result ) ) {
			quillforms_get_logger()->error(
				esc_html__( 'Cannot install addon plugin', 'quillforms' ),
				array(
					'code'       => 'cannot_install_addon_plugin',
					'addon_slug' => $addon_slug,
					'error'      => array(
						'code'    => $installer_skin->result->get_error_code(),
						'message' => $installer_skin->result->get_error_message(),
						'data'    => $installer_skin->result->get_error_data(),
					),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// check failed installation.
		if ( ! $installer_skin->result || ! $installer->plugin_info() ) {
			quillforms_get_logger()->error(
				esc_html__( 'Cannot install addon plugin', 'quillforms' ),
				array(
					'code'             => 'cannot_install_addon_plugin',
					'addon_slug'       => $addon_slug,
					'upgrade_messages' => $installer_skin->get_upgrade_messages(),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// check the installed plugin.
		if ( $installer->plugin_info() !== $this->addons[ $addon_slug ]['plugin_file'] ) {
			if ( ! function_exists( 'delete_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			$removed = delete_plugins( array( $installer->plugin_info() ) );
			quillforms_get_logger()->critical(
				esc_html__( 'Invalid addon installation detected', 'quillforms' ),
				array(
					'code'                  => 'invalid_addon_installation',
					'addon_slug'            => $addon_slug,
					'plugin_file'           => $this->addons[ $addon_slug ]['plugin_file'],
					'installer_plugin_info' => $installer->plugin_info(),
					'removed'               => $removed,
					'upgrade_messages'      => $installer_skin->get_upgrade_messages(),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// log successful installation.
		quillforms_get_logger()->info(
			esc_html__( 'Addon plugin installed successfully', 'quillforms' ),
			array(
				'code'             => 'addon_installed_successfully',
				'addon_slug'       => $addon_slug,
				'upgrade_messages' => $installer_skin->get_upgrade_messages(),
			)
		);
		return array(
			'success' => true,
			'message' => esc_html__( 'Addon plugin installed successfully', 'quillforms' ),
		);
	}

	/**
	 * Activate addon
	 *
	 * @param string $addon_slug Addon slug.
	 * @return array
	 */
	public function activate( $addon_slug ) {
		// check addon.
		if ( ! isset( $this->addons[ $addon_slug ] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot find addon', 'quillforms' ),
			);
		}

		// check if not installed.
		if ( ! $this->addons[ $addon_slug ]['is_installed'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( "Addon isn't installed", 'quillforms' ),
			);
		}

		// check if already active.
		if ( $this->addons[ $addon_slug ]['is_active'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Addon is already active', 'quillforms' ),
			);
		}

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
	 * Ajax handler for installing addon
	 *
	 * @return mixed
	 */
	public function ajax_install() {
		$this->check_authorization();

		// posted addon slug.
		$addon_slug = trim( $_POST['addon'] ?? '' );
		if ( empty( $addon_slug ) ) {
			wp_send_json_error( esc_html__( 'Addon slug is required', 'quillforms' ), 400 );
			exit;
		}

		$result = $this->install( $addon_slug );
		if ( $result['success'] ) {
			wp_send_json_success( esc_html__( 'Addon plugin installed successfully', 'quillforms' ), 200 );
		} else {
			wp_send_json_error( $result['message'] ?? esc_html__( 'Cannot install the addon plugin, please check the log for details', 'quillforms' ), 422 );
		}
		exit;
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
			'entries'               => array(
				'name'           => esc_html__( 'Entries', 'quillforms' ),
				'description'    => esc_html__( 'Store, view, manage and export entries', 'quillforms' ),
				'plugin_file'    => 'QuillForms-Entries/quillforms-entries.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => '',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/entries/banner.png',
				),
			),
			'logic'                 => array(
				'name'           => esc_html__( 'Logic', 'quillforms' ),
				'description'    => esc_html__( 'Jump logic and calculator', 'quillforms' ),
				'plugin_file'    => 'QuillForms-Logic/quillforms-logic.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => '',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/logic/banner.png',
				),
			),
			'fileblock'             => array(
				'name'           => esc_html__( 'File Block', 'quillforms' ),
				'description'    => esc_html__( 'Enable users to upload files', 'quillforms' ),
				'plugin_file'    => 'QuillForms-FileBlock/quillforms-fileblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => '',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/file-block/banner.png',
				),
			),
			'opinionscaleblock'     => array(
				'name'           => esc_html__( 'Opinion Scale Block', 'quillforms' ),
				'description'    => esc_html__( 'Opinion Scale Block', 'quillforms' ),
				'plugin_file'    => 'QuillForms-OpinionScaleBlock/quillforms-opinionscaleblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => '',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/opinion-scale/banner.png',
				),
			),
			'custom-thankyouScreen' => array(
				'name'           => esc_html__( 'Custom Thank You Screen', 'quillforms' ),
				'description'    => esc_html__( 'Custom Thank You Screen', 'quillforms' ),
				'plugin_file'    => 'QuillForms-custom-thankyouScreen/quillforms-customthankyouscreen.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => '',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/custom-thankyou-screen/banner.png',
				),
			),
			'constantcontact'       => array(
				'name'           => esc_html__( 'Constant Contact', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your Constant Contact lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-ConstantContact/quillforms-constantcontact.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/constantcontact/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/constantcontact/banner.png',
				),
			),
			'mailchimp'             => array(
				'name'           => esc_html__( 'MailChimp', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your MailChimp lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-MailChimp/quillforms-mailchimp.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailchimp/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailchimp/banner.png',
				),
			),
			'getresponse'           => array(
				'name'           => esc_html__( 'GetResponse', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your GetResponse lists', 'quillforms' ),
				'plugin_file'    => 'QuillForms-GetResponse/quillforms-getresponse.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/getresponse/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/getresponse/banner.png',
				),
			),
			'googlesheets'          => array(
				'name'           => esc_html__( 'GoogleSheets', 'quillforms' ),
				'description'    => esc_html__( 'Send your submission to Google Sheets. Syncs automatically when a new form is submitted!', 'quillforms' ),
				'plugin_file'    => 'QuillForms-GoogleSheets/quillforms-googlesheets.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/googlesheets/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/googlesheets/banner.png',
				),
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
