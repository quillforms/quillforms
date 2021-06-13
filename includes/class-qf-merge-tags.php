<?php
/**
 * Merge Tags: class QF_Merge_Tags
 *
 * @since 1.0.0
 * @package QuillForms
 */

/**
 * This class is to handle merge tags.
 * Merge tags should have the same structure with type and modifier {{type:modifer}}
 * One example is {{field:field_id}}, here the type of merge tag is "field" and the modifier is its id.
 * The class should parse the merge tags to human readable values according to their type and their modifier.
 *
 * @since 1.0.0
 */
class QF_Merge_Tags {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_filter( 'quillforms_process_merge_tag', array( $this, 'process_field_merge_tag' ), 10, 6 );
	}

	/**
	 * Process merge tags.
	 *
	 * @since 1.0.0
	 */

	public static function process_tag( $string, $form_data, $answers, $entry_id ) {

		$merge_tag_regex = '/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/';
		$string          = preg_replace_callback(
			$merge_tag_regex,
			function( $matches ) use ( $form_data, $fields, $answers, $entry_id ) {

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
	 * Process field merge tag
	 *
	 * @since 1.0.0
	 */
	public function process_field_merge_tag( $replacement, $merge_tag_type, $merge_tag_modifier, $form_data, $answers, $entry_id ) {
		if ( 'field' === $merge_tag_type ) {
			$field_id = $merge_tag_modifier;

			if ( ! is_array( $answers[ $field_id ] ) || ! $answers[ $field_id ]['blockName'] || ! isset( $answers[ $field_id ]['value'] ) ) {
				return '';
			}
			$block_type = QF_Blocks_Factory::get_instance()->get_registered( $answers[ $field_id ]['blockName'] );
			return $block_type->get_merge_tag_value( $answers[ $field_id ]['value'], $form_data );
		}
		return $replacement;
	}

}

new QF_Merge_Tags();
