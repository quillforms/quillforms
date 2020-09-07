<?php
/**
 * Convenience functions for PageController.
 *
 * @package QuillForms
 * @subpackage Admin
 * @since 1.0.0
 */

/**
 * Register JS-powered QuillForms Admin Page.
 * Passthrough to PageController::register_page().
 *
 * @param array $options {
 *  {
 *   Options for PageController::register_page().
 *
 *   @type string      id           Id to reference the page.
 *   @type string      title        Page title. Used in menus and breadcrumbs.
 *   @type string|null parent       Parent ID. Null for new top level page.
 *   @type string      path         Path for this page, full path in app context; ex /settings
 *   @type string      capability   Capability needed to access the page.
 *   @type string      icon         Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
 *   @type int         position     Menu item position.
 * }
 */
function qf_admin_register_page( $options ) {
	$controller = QF_Admin_Page_Controller::get_instance();
	$controller->register_page( $options );
}

/**
 * Is this a QuillForms Admin Page?
 * Passthrough to PageController::is_registered_page().
 *
 * @return boolean True if the page is a QuillForms Admin page.
 */
function qf_admin_is_registered_page() {
	$controller = QF_Admin_Page_Controller::get_instance();
	return $controller->is_registered_page();
}
