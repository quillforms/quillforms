<?php
/**
 * RESTFields: Responses Count
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

use QuillForms\Entries\Entry;

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'responses_count',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = Entry::get_count($form_id);
			$value = $value ? $value : 0;

			return $value;
		},
    )
);
