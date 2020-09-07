<?php
/**
 * Capabilities: class QF_Capabilities
 *
 * @package QuillForms
 * @subpackage Capabilities
 * @since 1.0.0
 */

/**
 * Class QF_Capabilities is for getting capabilities and assigning them to user roles.
 */
class QF_Capabilities {

	/**
	 * Init
	 *
	 * @since 1.0.0
	 */
	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'assign_capabilities_for_user_roles' ) );
	}

	/**
	 * Get capabilities for WooCommerce - these are assigned to admin/shop manager during installation or reset.
	 *
	 * @since 1.0.0
	 *
	 * @return array The core capabilities
	 */
	private static function get_core_capabilities() {
		$capabilities = array();

		$capabilities['core'] = array(
			'manage_quillforms',
		);

		$capability_types = array(
			'quillform'       => array(
				'plural'   => 'quillforms',
				'singular' => 'quillform',
			),
			'quillform_entry' => array(
				'plural'   => 'quillform_entries',
				'singular' => 'quillform_entry',
			),
		);

		foreach ( $capability_types as $capability_type => $capability_obj ) {

			$capabilities[ $capability_type ] = array(
				// Post type.
				"edit_{$capability_obj['singular']}",
				"read_{$capability_obj['singular']}",
				"delete_{$capability_obj['singular']}",
				"edit_{$capability_obj['plural']}",
				"publish_{$capability_obj['plural']}",
				"delete_{$capability_obj['plural']}",
			);
		}

		return $capabilities;
	}

	/**
	 * Assign capabilities for user roles.
	 *
	 * @since 1.0.0
	 */
	public static function assign_capabilities_for_user_roles() {
		global $wp_roles;

		if ( ! class_exists( 'WP_Roles' ) ) {
			return;
		}

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles(); // @codingStandardsIgnoreLine
		}

		$capabilities = self::get_core_capabilities();

		foreach ( $capabilities as $cap_group ) {
			foreach ( $cap_group as $cap ) {
				$wp_roles->add_cap( 'administrator', $cap );
			}
		}
	}
}
QF_Capabilities::init();
