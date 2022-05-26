<?php
/**
 * Rest_Field_Controller class.
 *
 * @since 1.10.0
 * @package QuillForms
 */

namespace QuillForms\Addon\REST;

use QuillForms\Addon\Addon;

/**
 * Rest_Field_Controller abstract class.
 *
 * @since 1.10.0
 */
abstract class Rest_Field_Controller {

	/**
	 * Rest field name
	 *
	 * @since 1.10.0
	 *
	 * @var string|null
	 */
	protected $field_name;

	/**
	 * Addon
	 *
	 * @since 1.10.0
	 *
	 * @var Addon
	 */
	protected $addon;

	/**
	 * Constructor.
	 *
	 * @since 1.10.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		$this->addon = $addon;

		register_rest_field(
			'quill_forms',
			$this->field_name ?? "addon_{$this->addon->slug}",
			array(
				'get_callback'    => array( $this, 'get_callback' ),
				'update_callback' => array( $this, 'update_callback' ),
				'schema'          => array(
					'description' => "Rest field data for {$this->addon->slug} addon.",
					'arg_options' => array(
						'sanitize_callback' => array( $this, 'sanitize_callback' ),
						'validate_callback' => array( $this, 'validate_callback' ),
					),
				),
			)
		);
	}

	/**
	 * Retrieves schema, conforming to JSON Schema.
	 * Should include context for gettable data
	 * Should include additionalProperties & readonly to specify updatable data
	 *
	 * @since 1.10.0
	 *
	 * @return array
	 */
	abstract public function get_schema();

	/**
	 * Rest field get_callback
	 *
	 * @since 1.10.0
	 *
	 * @param array $object Object.
	 * @return array
	 */
	public function get_callback( $object ) {
		$data = $this->addon->form_data->get( $object['id'] ) ?? array();
		return rest_filter_response_by_context( $data, $this->get_schema(), 'view' );
	}

	/**
	 * Rest field get_callback
	 *
	 * @since 1.10.0
	 *
	 * @param array  $data Addon form data.
	 * @param object $object Object.
	 * @return boolean
	 */
	public function update_callback( $data, $object ) {
		return $this->addon->form_data->update( $object->ID, $data, false );
	}

	/**
	 * Sanitize callback
	 *
	 * @since 1.10.0
	 *
	 * @param array $data Data.
	 * @return array
	 */
	public function sanitize_callback( $data ) {
		return rest_sanitize_value_from_schema(
			$data,
			$this->get_schema()
		);
	}

	/**
	 * Validate callback
	 *
	 * @since 1.10.0
	 *
	 * @param array $data Data.
	 * @return array
	 */
	public function validate_callback( $data ) {
		return rest_validate_value_from_schema(
			$data,
			$this->get_schema()
		);
	}

}
