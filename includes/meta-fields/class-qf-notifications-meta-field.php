<?php
/**
 * Metafields: class QF_Notifications_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Blocks_Meta_Field
 *
 * @since 1.0.0
 */
class QF_Notifications_Meta_Field extends QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 */
	public function get_slug() {
		return 'notifications';
	}

	/**
	 * Get field value
	 *
	 * @since 1.0.0
	 * @param array $object Form object.
	 *
	 * @return mixed The value
	 */
	public function get_value( $object ) {
		$form_id = $object['id'];

		$value = qf_decode( get_post_meta( $form_id, $this->get_slug(), true ) );
		$value = $value ? $value : array();

		return $this->prepare_notifications_for_render( $value );
	}

	/**
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress REST api.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 *
	 * @return array The schema
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
	 * @access private
	 *
	 * @return array notification proeprties.
	 */
	private function get_single_notification_properties() {
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
	 * @access private
	 *
	 * @param array $data Optional. original notifications data.
	 *
	 * @return array The notifications to render.
	 */
	private function prepare_notifications_for_render( $data = array() ) {
		return $data;
	}
}

QF_Meta_Fields_Factory::get_instance()->register( new QF_Notifications_Meta_Field() );
