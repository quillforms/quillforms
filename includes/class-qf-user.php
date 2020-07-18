<?php
/**
 * User: class QF_User
 *
 * @since 1.0.0
 * @package QuillForms
 */

defined( 'ABSPATH' ) || exit;

/**
 * Quill Forms user.
 *
 * Quill Forms user handler class is responsible for checking if the user can edit
 * with Quill Forms
 *
 * @since 1.0.0
 */
class QF_User {

	/**
	 * Is current user can edit.
	 *
	 * Whether the current user can edit the form.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @param int $form_id Required. The Form ID.
	 *
	 * @return bool whether the current user can edit the form
	 */
	public static function is_current_user_can_edit( $form_id ) {
		$post = get_post( $form_id );
		if ( ! $post ) {
			return false;
		}

		if ( 'trash' === get_post_status( $form_id ) ) {
			return false;
		}

		if ( ! current_user_can( 'edit_quill_forms' ) ) {
			return false;
		}

		return true;
	}
}
