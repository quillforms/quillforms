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
	 * Blocks of the form that $form_blocks_map was built for.
	 *
	 * @since 5.7.4
	 *
	 * @var array|null
	 */
	private $form_blocks = null;

	/**
	 * Block data, and block type once created, keyed by block id.
	 *
	 * @since 5.7.4
	 *
	 * @var array
	 */
	private $form_blocks_map = array();

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
					// var_dump($condition);
					if(!empty($condition['value']) && isset($condition['type']) && $condition['type'] === 'variable'  ) {
						$condition['value'] = $entry->get_record_value('variable', $condition['value']) ?? '';
					}
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

		// get block data and block type.
		$block = $this->get_form_block( $form_data, $field_id );
		if ( ! $block ) {
			return null;
		}
		$block_data = $block['data'];
		$block_type = $block['type'];
		if ( ! $block_type ) {
			return null;
		}
		else {
			if($block_type->is_value_array() || $block_data['name'] === 'phone' || $block_data['name'] === 'calendly' || $block_data['name'] === 'calcom' ) {
				if(!is_array($raw_value)) {
					$raw_value = (array) $raw_value;
				}
			}
			else {
				if(is_array($raw_value)) {
					$raw_value = '';
				}
			}
		}

		return apply_filters('quillforms_get_field_readable_value', $block_type->get_readable_value( $raw_value, $form_data, $context ), $field_id, $block_type, $raw_value, $entry, $form_data, $context );
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
		// get block type.
		$block = $this->get_form_block( $form_data, $field_id );
		if ( ! $block || ! $block['type'] ) {
			return false;
		}

		$value = $entry->get_record_value( 'field', $field_id ) ?? '';
		return $block['type']->is_condition_fulfilled( $value, $condition );
	}

	/**
	 * Get a block's data and block type from form data
	 *
	 * Exports, analytics and filters read every field of thousands of entries.
	 * Walking the form's blocks and creating a new block type for each field
	 * of each entry made that cost grow with the square of the form size, so
	 * the blocks are indexed once per form and each block type is created once.
	 *
	 * @since 5.7.4
	 *
	 * @param array  $form_data Form data.
	 * @param string $block_id  Block id.
	 * @return array|null Array with 'data' and 'type' (Block_Type or false), null if not found.
	 */
	private function get_form_block( $form_data, $block_id ) {
		$blocks = $form_data['blocks'] ?? array();

		// Comparing the very same array is instant; any other form rebuilds the index.
		if ( null === $this->form_blocks || $blocks !== $this->form_blocks ) {
			$this->form_blocks     = $blocks;
			$this->form_blocks_map = array();
			foreach ( Core::get_blocks_recursively( $blocks ) as $block_data ) {
				if ( isset( $block_data['id'] ) && ! isset( $this->form_blocks_map[ $block_data['id'] ] ) ) {
					$this->form_blocks_map[ $block_data['id'] ] = array( 'data' => $block_data );
				}
			}
		}

		if ( ! isset( $this->form_blocks_map[ $block_id ] ) ) {
			return null;
		}

		if ( ! array_key_exists( 'type', $this->form_blocks_map[ $block_id ] ) ) {
			$this->form_blocks_map[ $block_id ]['type'] = Blocks_Manager::instance()->create( $this->form_blocks_map[ $block_id ]['data'] );
		}

		return $this->form_blocks_map[ $block_id ];
	}

}
