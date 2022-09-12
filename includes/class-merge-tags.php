<?php
/**
 * Merge Tags: class Merge_Tags
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

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
	 * @var array type => args
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
		$this->register( 'property', array( 'process' => array( $this, 'process_property_merge_tag' ) ) );
		$this->register( 'website', array( 'process' => array( $this, 'process_website_merge_tag' ) ) );
	}

	/**
	 * Register merge tag type
	 *
	 * @since 1.8.9
	 *
	 * @param string $type Merge tag type.
	 * @param array  $args {
	 *      Merge tag type args.
	 *      @type callable $process Process callback accepts $merge_tag_modifier, $entry, $form_data and $context.
	 * }
	 */
	public function register( $type, $args ) {
		if ( ! isset( $this->types[ $type ] ) && is_callable( $args['process'] ) ) {
			$this->types[ $type ] = $args;
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
	 * Process tag or text
	 * If tag is unknown, it will be processed as text
	 *
	 * @since 1.13.0
	 *
	 * @param array  $data Array contains 'type' and 'value'. type can be text or any registered merge tag.
	 * @param Entry  $entry Entry.
	 * @param array  $form_data Form data.
	 * @param string $context Context.
	 * @return string|null
	 */
	public function process( $data, $entry, $form_data, $context = 'html' ) {
		if ( ! $data ) {
			return null;
		}
		$type  = $data['type'] ?? null;
		$value = $data['value'] ?? '';
		if ( in_array( $type, $this->get_registered_types(), true ) ) {
			return $this->process_tag( $type, $value, $entry, $form_data, $context );
		} else {
			return $this->process_text( $value, $entry, $form_data, $context );
		}
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
			'/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/',
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
			$value = $this->types[ $type ]['process']( $modifier, $entry, $form_data, $context );
			return apply_filters( "quillforms_process_{$type}_merge_tag", $value, $modifier, $entry, $form_data, $context );
		} else {
			return null;
		}
	}

	/**
	 * Process property merge tag.
	 * Property merge tag is when we have {{property:any}} in the string.
	 * So, now the merge tag type is "property" and the modifier is "any".
	 * We need to do some processing on this merge tag and replace it with the appropriate string.
	 *
	 * @since 1.8.9
	 *
	 * @param string $modifier  The merge tag modifier.
	 * @param Entry  $entry     The entry object.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_property_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
		switch ( $modifier ) {
			case 'id':
				return $entry->ID ?? '';
			case 'form_id':
				return $entry->form_id;
			case 'date_created':
				return $entry->date_created;
			case 'date_updated':
				return $entry->date_updated;
			case 'user_id':
				return $entry->get_meta_value( 'user_id' ) ?? '';
			case 'user_ip':
				return $entry->get_meta_value( 'user_ip' ) ?? '';
			case 'user_agent':
				return $entry->get_meta_value( 'user_agent' ) ?? '';
		}
		return '';
	}

	/**
	 * Process website merge tag.
	 * Website merge tag is when we have {{website:any}} in the string.
	 * So, now the merge tag type is "website" and the modifier is "any".
	 * We need to do some processing on this merge tag and replace it with the appropriate string.
	 *
	 * @since 1.8.9
	 *
	 * @param string $modifier  The merge tag modifier.
	 * @param Entry  $entry     The entry object.
	 * @param array  $form_data The form data and settings.
	 * @param string $context   The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_website_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
		switch ( $modifier ) {
			case 'admin_ajax_url':
				return admin_url( 'admin-ajax.php' );
			case 'rest_api_url':
				return rest_url();
		}
		return '';
	}

}
