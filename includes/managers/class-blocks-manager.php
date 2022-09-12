<?php
/**
 * Blocks API: Blocks_Manager class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

namespace QuillForms\Managers;

use QuillForms\Abstracts\Block_Type;

/**
 * Core class used for interacting with block types.
 *
 * @since 1.0.0
 */
final class Blocks_Manager {
	/**
	 * Registered block types, as `$name => $instance` pairs.
	 *
	 * @since 1.0.0
	 *
	 * @var Block_Type[]
	 */
	private $registered_block_types = array();

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var Blocks_Manager|null
	 */
	private static $instance = null;

	/**
	 * Registers a block type.
	 *
	 * @since 1.0.0
	 *
	 * @param Block_Type $block Block_Type instance.
	 *
	 * @return Block_Type the registered block type on success, or false on failure
	 */
	public function register( Block_Type $block ) {
		$block_type = $block;
		$block_name = $block_type->name;

		if ( preg_match( '/[A-Z]+/', $block_name ) ) {
			$message = __( 'Block type names must not contain uppercase characters.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		if ( $this->is_registered( $block_name ) ) {
			/* translators: %s: Block name. */
			$message = sprintf( __( 'Block type "%s" is already registered.', 'quillforms' ), $block_name );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$this->registered_block_types[ $block_name ] = $block_type;

		return $block_type;
	}

	/**
	 * Unregisters a block type.
	 *
	 * @since 1.0.0
	 *
	 * @param string|Block_Type $type block type name including namespace, or alternatively a
	 *                              complete Block_Type instance.
	 *
	 * @return Block_Type|false the unregistered block type on success, or false on failure
	 */
	public function unregister( $type ) {

		if ( ! $this->is_registered( $type ) ) {
			/* translators: %s: Block name. */
			$message = sprintf( __( 'Block type "%s" is not registered.', 'quillforms' ), $type );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$unregistered_block_type = $this->registered_block_types[ $type ];
		unset( $this->registered_block_types[ $type ] );

		return $unregistered_block_type;
	}

	/**
	 * Creates a block object from an array of field properties.
	 * This function will be used for fields only so we can access methods like validating, snaitizing, ...etc.
	 *
	 * @param array $properties The block properties.
	 *
	 * @return Block_Type|bool
	 */
	public function create( $properties ) {

		$block_name = isset( $properties['name'] ) ? $properties['name'] : '';

		if ( empty( $block_name ) || ! isset( $this->registered_block_types[ $block_name ] ) ) {
			/* translators: %s for block type */
			$message = sprintf( esc_html__( 'Block type %s is not defined.', 'quillforms' ), $block_name );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$class      = $this->registered_block_types[ $block_name ];
		$class_name = get_class( $class );
		$block      = new $class_name( $properties );

		return $block;
	}

	/**
	 * Retrieves a registered block type.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name block type name including namespace.
	 *
	 * @return Block_Type|null the registered block type, or null if it is not registered
	 */
	public function get_registered( $name ) {
		if ( ! $this->is_registered( $name ) ) {
			return null;
		}

		return $this->registered_block_types[ $name ];
	}

	/**
	 * Retrieves all registered block types.
	 *
	 * @since 1.0.0
	 *
	 * @return Block_Type[] associative array of `$block_type_name => $block_type` pairs
	 */
	public function get_all_registered() : iterable {
		return $this->registered_block_types;
	}

	/**
	 * Checks if a block type is registered.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name block type name including namespace.
	 *
	 * @return bool true if the block type is registered, false otherwise
	 */
	public function is_registered( $name ) : bool {
		return isset( $this->registered_block_types[ $name ] );
	}

	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return Blocks_Manager the main instance
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
