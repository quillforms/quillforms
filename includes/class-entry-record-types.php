<?php
/**
 * Class Entry_Record_Types
 *
 * @since next.version
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Managers\Blocks_Manager;

/**
 * Entry_Record_Types Class
 *
 * @since next.version
 */
class Entry_Record_Types {

	/**
	 * Types
	 *
	 * @since next.version
	 *
	 * @var array
	 */
	private $types = array();

	/**
	 * Class instance
	 *
	 * @since next.version
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since next.version
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
	 * @since next.version
	 */
	private function __construct() {
		$this->register(
			'field',
			array(
				'section'            => 'fields',
				'get_readable_value' => array( $this, 'get_field_readable_value' ),
			)
		);
	}

	/**
	 * Register
	 *
	 * @since next.version
	 *
	 * @param string $type Record type.
	 * @param array  $args {
	 *     Record type args.
	 *     @type string $section Section. Required.
	 *     @type callable $get_readable_value Callable. Optional. Accepts $record_id, $entry, $form_data, $context.
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
			function( $record_id, $entry, $form_data, $context ) use ( $type ) {
				return $entry->get_record_readable_value( $type, $record_id, $form_data, $context ) ?? '';
			}
		);

		$this->types[ $type ] = $args;
		return true;
	}

	/**
	 * Get all types
	 *
	 * @since next.version
	 *
	 * @return array
	 */
	public function get_all() {
		return $this->types;
	}

	/**
	 * Get type
	 *
	 * @since next.version
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
	 * @since next.version
	 *
	 * @param string $field_id  Field id.
	 * @param Entry  $entry     Entry object.
	 * @param array  $form_data Form data.
	 * @param string $context   Context.
	 * @return mixed
	 */
	public function get_field_readable_value( $field_id, $entry, $form_data, $context ) {
		$raw_value = $entry->records['fields'][ $field_id ]['value'] ?? null;
		if ( null === $raw_value ) {
			return null;
		}

		// get block data.
		$block_data = array_values(
			array_filter(
				$form_data['blocks'],
				function( $block ) use ( $field_id ) {
					return $block['id'] === $field_id;
				}
			)
		) [0] ?? null;
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

}
