<?php

class QF_Form_Notifications {
	/**
	 * Get single notification properties
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return array notification proeprties.
	 */
	public static function get_single_notification_properties() {
		return apply_filters(
			'quillforms_single_notification_properties',
			array(
				'title'      => array(
					'type' => 'string',
				),
				'active'     => array(
					'type' => 'boolean',
				),
				'toType'     => array(
					'type' => 'string',
					'enum' => array( 'email', 'field' ),
				),
				'recipients' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'replyTo'    => array(
					'type' => 'string',
				),
				'subject'    => array(
					'type' => 'string',
				),
				'message'    => array(
					'type'    => 'string',
					'default' => '{{form:all_answers}}',
				),
			)
		);
	}


	/**
	 * Prepare notifications for render
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param array $data Optional. original notifications data.
	 *
	 * @return array The notifications to render.
	 */
	public static function prepare_notifications_for_render( $data = array() ) {
		return $data;
	}
}
