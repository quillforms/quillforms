<?php
/**
 * Merge Tags: class Merge_Tags
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Managers\Blocks_Manager;

/**
 * This class is to handle merge tags.
 * Merge tags should have the same structure with type and modifier {{type:modifer}}
 * One example is {{field:field_id}}, here the type of merge tag is "field" and the modifier is its id.
 * The class should parse the merge tags to merge tag values according to their type and their modifier.
 *
 * @since 1.0.0
 */
class Merge_Tags {

	/**
	 * Types
	 *
	 * @since 1.8.9
	 *
	 * @var array type => callback
	 */
	private $types = array();

	/**
	 * Class instance
	 *
	 * @since 1.0.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->register( 'entry', array( $this, 'process_entry_merge_tag' ) );
		$this->register( 'field', array( $this, 'process_field_merge_tag' ) );
	}

	/**
	 * Register merge tag type
	 *
	 * @since 1.8.9
	 *
	 * @param string   $type Merge tag type.
	 * @param callback $callback Process callback accepts $merge_tag_modifier, $entry, $form_data and $context.
	 */
	public function register( $type, $callback ) {
		if ( ! isset( $this->types[ $type ] ) && is_callable( $callback ) ) {
			$this->types[ $type ] = $callback;
		}
	}

	/**
	 * Get registered types
	 *
	 * @since 1.8.9
	 *
	 * @return array
	 */
	public function get_registered_types() {
		return array_keys( $this->types );
	}

	/**
	 * Process merge tags on text.
	 * It is very important to mention that merge tags in this plugin are a bit different.
	 * They have a consistent structure {{a:b}} where "a" is the merge tag type and "b" is the merge tag modifier.
	 * It worth mentioning that no other structure will be working like for example: {a:b} or {{a=b}}, those won't work.
	 *
	 * @since 1.8.9
	 *
	 * @param string $text      The string on which merge tags will be processed.
	 * @param array  $entry     The entry data.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_text( $text, $entry, $form_data, $context = 'html' ) {
		return preg_replace_callback(
			'/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/',
			function( $matches ) use ( $entry, $form_data, $context ) {
				return $this->process_tag( $matches[1], $matches[2], $entry, $form_data, $context ) ?? $matches[0];
			},
			$text
		);
	}

	/**
	 * Process tag.
	 *
	 * @since 1.8.9
	 *
	 * @param string $type      The merge tag type.
	 * @param string $modifier  The merge tag modifier.
	 * @param array  $entry     The entry data.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 * @return string|null
	 */
	public function process_tag( $type, $modifier, $entry, $form_data, $context ) {
		if ( isset( $this->types[ $type ] ) ) {
			return $this->types[ $type ]( $modifier, $entry, $form_data, $context );
		} else {
			return null;
		}
	}

	/**
	 * Process entry merge tag.
	 * Field merge tag is when we have {{entry:any}} in the string.
	 * So, now the merge tag type is "entry" and the modifier is "any".
	 * We need to do some processing on this merge tag and replace it with the appropriate string.
	 *
	 * @since 1.8.9
	 *
	 * @param string $modifier  The merge tag modifier.
	 * @param array  $entry     The formatted answers.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_entry_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
		switch ( $modifier ) {
			case 'id':
				return $entry['id'] ?? '';
			case 'form_id':
				return $entry['form_id'] ?? '';
			case 'date_created':
				return gmdate( 'Y-m-d H:i:s' ); // TODO: implement it.
			case 'user_id':
				return $entry['meta']['user_id'] ?? '';
			case 'user_ip':
				return $entry['meta']['user_ip'] ?? '';
			case 'user_agent':
				return $entry['meta']['user_agent'] ?? '';
		}
		return '';
	}

	/**
	 * Process field merge tag.
	 * Field merge tag is when we have {{field:any}} in the string.
	 * So, now the merge tag type is "field" and the modifier is "any".
	 * We need to do some processing on this merge tag and replace it with the appropriate string.
	 *
	 * @since 1.8.9
	 *
	 * @param string $modifier  The merge tag modifier.
	 * @param array  $entry     The formatted answers.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_field_merge_tag( $modifier, $entry, $form_data, $context ) {
		$field_id = $modifier;
		if ( ! isset( $entry['answers'][ $field_id ]['value'] ) ) {
			return '';
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
			return '';
		}

		// get block type.
		$block_type = Blocks_Manager::instance()->create( $block_data );
		if ( ! $block_type ) {
			return '';
		}

		return $block_type->get_readable_value( $entry['answers'][ $field_id ]['value'], $form_data, $context );
	}

}
