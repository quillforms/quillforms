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
	 * Class instance.
	 *
	 * @var Merge_Tags instance
	 */
	private static $instance = null;

	/**
	 * Get class instance.
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
		add_filter( 'quillforms_process_merge_tag', array( $this, 'process_field_merge_tag' ), 10, 6 );
	}

	/**
	 * Process merge tags.
	 * It is very important to mention that merge tags in this plugin are a bit different.
	 * They have a consistent structure {{a:b}} where "a" is the merge tag type and "b" is the merge tag modifier.
	 * It worth mentioning that no other structure will be working like for example: {a:b} or {{a=b}}, those won't work.
	 *
	 * @since 1.0.0
	 *
	 * @param string $string      The string on which merge tags will be processed.
	 * @param array  $entry       The entry data.
	 * @param array  $form_data   The form data and settings.
	 * @param string $context     The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public static function process_tag( $string, $entry, $form_data, $context = 'html' ) {

		$merge_tag_regex = '/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/';
		$string          = preg_replace_callback(
			$merge_tag_regex,
			function( $matches ) use ( $entry, $form_data, $context ) {

				$merge_tag_type     = $matches[1];
				$merge_tag_modifier = $matches[2];
				// The default tag replacement is doing nothing!
				$default_replacement = '{{' . $merge_tag_type . ':' . $merge_tag_modifier . '}}';
				$replacement         = apply_filters( 'quillforms_process_merge_tag', $default_replacement, $merge_tag_type, $merge_tag_modifier, $entry, $form_data, $context );
				return $replacement;
			},
			$string
		);

		return $string;
	}


	/**
	 * Process field merge tag.
	 * Field merge tag is when we have {{field:any}} in the string.
	 * So, now the merge tag type is "field" and the modifier is "any".
	 * We need to do some processing on this merge tag and replace it with the appropriate string.
	 *
	 * @since 1.0.0
	 *
	 * @param string $replacement         The string that should be replaced.
	 * @param string $merge_tag_type      The merge tag type.
	 * @param string $merge_tag_modifier  The merge tag modifier.
	 * @param array  $entry       The formatted answers.
	 * @param array  $form_data   The form data and settings.
	 * @param string $context     The context.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_field_merge_tag( $replacement, $merge_tag_type, $merge_tag_modifier, $entry, $form_data, $context ) {
		if ( 'field' === $merge_tag_type ) {
			$field_id = $merge_tag_modifier;
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
		return $replacement;
	}

}
