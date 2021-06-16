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
 * The class should parse the merge tags to human readable values according to their type and their modifier.
 *
 * @since 1.0.0
 */
class Merge_Tags {

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
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
	 * @param array  $form_data   The form data and settings.
	 * @param array  $answers     The formatted answers.
	 * @param int    $entry_id    The entry id.
	 *
	 * @return string The string after processing merge tags.
	 */
	public static function process_tag( $string, $form_data, $answers, $entry_id ) {

		$merge_tag_regex = '/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/';
		$string          = preg_replace_callback(
			$merge_tag_regex,
			function( $matches ) use ( $form_data, $answers, $entry_id ) {

				$merge_tag_type     = $matches[1];
				$merge_tag_modifier = $matches[2];
				// The default tag replacement is doing nothing!
				$default_replacement = '{{' . $merge_tag_type . ':' . $merge_tag_modifier . '}}';
				$replacement         = apply_filters( 'quillforms_process_merge_tag', $default_replacement, $merge_tag_type, $merge_tag_modifier, $form_data, $answers, $entry_id );
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
	 * @param array  $form_data   The form data and settings.
	 * @param array  $answers     The formatted answers.
	 * @param int    $entry_id    The entry id.
	 *
	 * @return string The string after processing merge tags.
	 */
	public function process_field_merge_tag( $replacement, $merge_tag_type, $merge_tag_modifier, $form_data, $answers, $entry_id ) {
		if ( 'field' === $merge_tag_type ) {
			$field_id = $merge_tag_modifier;

			if ( ! is_array( $answers[ $field_id ] ) || ! $answers[ $field_id ]['blockName'] || ! isset( $answers[ $field_id ]['value'] ) ) {
				return '';
			}
			$block_type = Blocks_Manager::get_instance()->get_registered( $answers[ $field_id ]['blockName'] );
			return $block_type->get_merge_tag_value( $answers[ $field_id ]['value'], $form_data );
		}
		return $replacement;
	}

}
