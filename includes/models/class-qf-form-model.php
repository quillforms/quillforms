<?php
/**
 * Form Model: QF_Form_Model class
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Core class used for interacting with database tables related to the form itself.
 *
 * @since 1.0.0
 */
class QF_Form_Model {

	/**
	 * Get form structure.
	 *
	 * @since 1.0.0
	 *
	 * @param int $form_id The form id.
	 * @static
	 *
	 * @return array The main form structure
	 */
	public static function get_form_structure( $form_id ) {

		$form_structure = qf_decode( get_post_meta( $form_id, 'structure', true ) );
		$form_structure = $form_structure ? array(
			'welcomeScreens'  => ! empty( $form_structure['welcomeScreens'] ) && is_array( $form_structure['welcomeScreens'] ) ?
									$form_structure['welcomeScreens'] : array(),
			'fields'          => ! empty( $form_structure['fields'] ) && is_array( $form_structure['fields'] ) ?
									$form_structure['fields'] : array(),
			'thankyouScreens' => ! empty( $form_structure['thankyouScreens'] ) && is_array( $form_structure['thankyouScreens'] ) ?
									$form_structure['fields'] : array(),
		) : array(
			'welcomeScreens'  => array(),
			'fields'          => array(),
			'thankyouScreens' => array(),
		);

		foreach ( $form_structure as $block_cat => $cat_items ) {
			if ( ! empty( $cat_items ) ) {
				foreach ( $cat_items as $index => $form_block ) {
					$block_type       = 'fields' === $block_cat ? $form_block['type'] : ( 'welcomeScreens' === $block_cat ? 'welcome-screen' : 'thankyou-screen' );
					$registered_block = QF_Blocks_Factory::get_instance()->get_registered( $block_type );
					if ( ! empty( $registered_block ) ) {
						$block_attributes                                     = $form_block['attributes'] ? $form_block['attributes'] : array();
						$form_structure[ $block_cat ][ $index ]['attributes'] = $registered_block->prepare_attributes_for_render( $block_attributes );
					}
				}
			}
		}

		return $form_structure;
	}

	/**
	 * Get form theme id.
	 *
	 * @since 1.0.0
	 *
	 * @param int $form_id The form id.
	 * @static
	 *
	 * @return int|null The applied theme id
	 */
	public static function get_form_theme_id( $form_id ) {
		$form_theme = get_post_meta( $form_id, 'theme_id', true );
		return $form_theme;
	}

	/**
	 * Get form theme.
	 *
	 * @since 1.0.0
	 * @static
	 * @global $wpdb
	 *
	 * @param int $form_id The form id.
	 *
	 * @return array The applied theme data
	 */
	public static function get_form_theme_data( $form_id ) {
		global $wpdb;

		$form_theme_data = array();
		$form_theme_id   = self::get_form_theme_id( $form_id );
		if ( ! empty( $form_theme_id ) ) {
			$form_theme_data = QF_Form_Theme_Model::get_theme_data( ( $form_theme_id ) );
		}
		return QF_Form_Theme::get_instance()->prepare_theme_data_for_render( $form_theme_data );
	}

	/**
	 * Get form messages.
	 *
	 * @since 1.0.0
	 *
	 * @param int $form_id The form id.
	 *
	 * @return array The form messages
	 */
	public static function get_form_messages( $form_id ) {
		// Get messages from post meta.
		$messages = get_post_meta( $form_id, 'messages', true );

		$messages = ! empty( $messages ) ? $messages : array();

		return QF_Form_Messages::get_instance()->prepare_messages_for_render( $messages );
	}
}
