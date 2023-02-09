<?php
/**
 * Class Entry_Record_Types
 *
 * @since 1.10.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Managers\Blocks_Manager;

/**
 * Entry_Record_Types Class
 *
 * @since 1.10.0
 */
class Entry_Record_Types {

	/**
	 * Types
	 *
	 * @since 1.10.0
	 *
	 * @var array
	 */
	private $types = array();

	/**
	 * Class instance
	 *
	 * @since 1.10.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.10.0
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
	 * @since 1.10.0
	 */
	private function __construct() {
		$this->register(
			'field',
			array(
				'section'                => 'fields',
				'get_readable_value'     => array( $this, 'get_field_readable_value' ),
				'is_condition_fulfilled' => array( $this, 'is_field_condition_fulfilled' ),
			)
		);
	}

	/**
	 * Register
	 *
	 * @since 1.10.0
	 *
	 * @param string $type Record type.
	 * @param array  $args {
	 *     Record type args.
	 *     @type string $section Section. Required.
	 *     @type callable $get_readable_value Callable. Optional. Accepts $record_id, $entry, $form_data, $context.
	 *     @type callable $is_condition_fulfilled Callable. Optional. Accepts $record_id, $condition, $entry, $form_data.
	 * }
	 * @return boolean
	 */
	public function register( $type, $args ) {
		if ( isset( $this->types[ $type ] ) ) {
			return false;
		}

		if ( ! isset( $args['section'] ) ) {
			return false;
		}

		// register record merge tag.
		Merge_Tags::instance()->register(
			$type,
			array(
				'process' => function( $record_id, $entry, $form_data, $context ) use ( $type ) {
					return $entry->get_record_readable_value( $type, $record_id, $form_data, $context ) ?? '';
				},
			)
		);

		// register logic condition type.
		Logic_Conditions::instance()->register(
			$type,
			array(
				'check' => $args['is_condition_fulfilled'] ?? function( $record_id, $condition, $entry, $form_data ) use ( $type ) { // phpcs:ignore
					$value = $entry->get_record_value( $type, $record_id ) ?? '';
					return Logic_Conditions::is_condition_fulfilled( $value, $condition );
				},
			)
		);

		$this->types[ $type ] = $args;
		return true;
	}

	/**
	 * Get all types
	 *
	 * @since 1.10.0
	 *
	 * @return array
	 */
	public function get_all() {
		return $this->types;
	}

	/**
	 * Get type
	 *
	 * @since 1.10.0
	 *
	 * @param string $type Type.
	 * @return array|null
	 */
	public function get( $type ) {
		return $this->types[ $type ] ?? null;
	}

	/**
	 * Get field readable value
	 *
	 * @since 1.10.0
	 *
	 * @param string $field_id  Field id.
	 * @param Entry  $entry     Entry object.
	 * @param array  $form_data Form data.
	 * @param string $context   Context.
	 * @return mixed
	 */
	public function get_field_readable_value( $field_id, $entry, $form_data, $context ) {
		$raw_value = $entry->get_record_value( 'field', $field_id );
		if ( null === $raw_value ) {
			return null;
		}

		// get block data.
		$block_data = quillforms_arrays_find( Core::get_blocks_recursively( $form_data['blocks'] ), 'id', $field_id );
		if ( ! $block_data ) {
			return null;
		}

		// get block type.
		$block_type = Blocks_Manager::instance()->create( $block_data );
		if ( ! $block_type ) {
			return null;
		}

		return $block_type->get_readable_value( $raw_value, $form_data, $context );
	}

	/**
	 * Is field condition fulfilled
	 *
	 * @since 1.13.0
	 *
	 * @param string $field_id  Field id.
	 * @param array  $condition {
	 *     Condition args.
	 *     @type string $operator Operator. Required.
	 *     @type mixed  $value Value. Required.
	 * }
	 * @param Entry  $entry     Entry object.
	 * @param array  $form_data Form data.
	 * @return boolean
	 */
	public function is_field_condition_fulfilled( $field_id, $condition, $entry, $form_data ) {
		// get block data.
		$block_data = quillforms_arrays_find( Core::get_blocks_recursively( $form_data['blocks'] ), 'id', $field_id );
		if ( ! $block_data ) {
			return false;
		}

		// get block type.
		$block_type = Blocks_Manager::instance()->create( $block_data );
		if ( ! $block_type ) {
			return false;
		}

		$value = $entry->get_record_value( 'field', $field_id ) ?? '';
		return $block_type->is_condition_fulfilled( $value, $condition );
	}

}
