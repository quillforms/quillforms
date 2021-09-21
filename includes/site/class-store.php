<?php
/**
 * Class: Store
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

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

}
