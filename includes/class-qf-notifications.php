<?php
/**
 * Notifications API: class QF_Notifications
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Quill forms notifications.
 *
 * @since 1.0.0
 */
class QF_Notifications {

	/**
	 * Get schema
	 *
	 * @since 1.0.0
	 *
	 * @return array Notifications schema
	 */
	public function get_schema() {
		return array(
			'type'        => 'array',
			'items'       => array(
				'type'       => 'object',
				'properties' => array(
					'id'         => array(
						'type' => 'string',
					),
					'properties' => $this->get_single_notification_properties(),
				),
			),
			'uniqueItems' => array( 'id' ),
		);
	}

	/**
	 * Get single notification properties
	 *
	 * @since 1.0.0
	 *
	 * @return array notification proeprties.
	 */
	public function get_single_notification_properties() {
		return array(
			'title'      => array(
				'type' => 'string',
			),
			'toType'     => array(
				'type' => 'string',
				'enum' => array( 'email', 'field' ),
			),
			'active'     => array(
				'type' => 'boolean',
			),
			'recipients' => array(
				'type'  => 'array',
				'items' => array(
					'type' => 'string',
				),
			),
			'reply_to'   => array(
				'type' => 'string',
			),
			'subject'    => array(
				'type' => 'string',
			),
			'message'    => array(
				'type'    => 'string',
				'default' => '{{form:all_answers}}',
			),
		);
	}

	/**
	 * Prepare notifications for render
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Optional. original notifications data.
	 *
	 * @return array The notifications to render.
	 */
	public function prepare_notifications_for_render( $data = array() ) {
		return $data;
	}


}
