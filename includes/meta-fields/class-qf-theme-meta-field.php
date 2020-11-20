<?php
/**
 * Metafields: class QF_Theme_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Theme_Meta_Field
 *
 * @since 1.0.0
 */
class QF_Theme_Meta_Field extends QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 */
	public function get_slug() {
		return 'theme';
	}

	/**
	 * Is array
	 *
	 * @since 1.0.0
	 */
	public function is_array() {
		return false;
	}

	/**
	 * Get field value
	 *
	 * @since 1.0.0
	 * @param array $object Form object.
	 *
	 * @return mixed The value
	 */
	public function get_value( $object ) {
		$form_id = $object['id'];

		$theme_id = get_post_meta( $form_id, $this->get_slug(), true );
		$theme_id = $theme_id ? $theme_id : null;
		return array(
			'id'         => $theme_id,
			'theme_data' => QF_Form_Theme_Model::get_theme_data( $theme_id ),
		);
	}

	/**
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress REST api.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 *
	 * @return array The schema
	 */
	public function get_schema() {
		return array(
			'type'       => 'object',
			'properties' => array(
				'properties' => $this->get_theme_properties(),
			),
		);
	}

	/**
	 * Get theme properties
	 *
	 * @since 1.0.0
	 *
	 * @return array Theme proeprties.
	 */
	public function get_theme_properties() {
		return array(
			'name'                 => array(
				'type'    => 'string',
				'default' => 'My Theme',
			),
			'font'                 => array(
				'type'    => 'string',
				'default' => 'Vollkorn',
			),
			'backgroundColor'      => array(
				'type'    => 'string',
				'default' => '#fff',
			),
			'backgroundImage'      => array(
				'type' => 'string',
			),
			'questionsColor'       => array(
				'type'    => 'string',
				'default' => '#000',
			),
			'answersColor'         => array(
				'type'    => 'string',
				'default' => '#000',
			),
			'buttonsFontColor'     => array(
				'type'    => 'string',
				'default' => '#fff',
			),
			'buttonsBgColor'       => array(
				'type'    => 'string',
				'default' => '#000',
			),
			'errorsFontColor'      => array(
				'type'    => 'string',
				'default' => '#fff',
			),
			'errorsBgColor'        => array(
				'type'    => 'string',
				'default' => '#f00',
			),
			'progressBarFillColor' => array(
				'type'    => 'string',
				'default' => '#000',
			),
			'progressBarBgColor'   => array(
				'type'    => 'string',
				'default' => '#e3e3e3',
			),
		);
	}

	/**
	 * Prepare theme for render
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $data Optional. original theme data.
	 *
	 * @return array The notifications to render.
	 */
	public function prepare_theme_data_for_render( $data = array() ) {
		// If there are no properties definitions for theme, skip
		// processing and return vebatim.
		$theme_properties_schema = $this->get_theme_properties();
		if ( empty( $theme_properties_schema ) ) {
			return $data;
		}

		foreach ( $data as $key => $value ) {
			// If the attribute is not defined by theme, it cannot be
			// validated.
			if ( ! isset( $theme_properties_schema[ $key ] ) ) {
				continue;
			}

			$schema = $theme_properties_schema[ $key ];

			// Validate value by JSON schema. An invalid value should revert to
			// its default, if one exists. This occurs by virtue of the missing
			// attributes loop immediately following. If there is not a default
			// assigned, the attribute value should remain unset.
			$is_valid = rest_validate_value_from_schema( $value, $schema );
			if ( is_wp_error( $is_valid ) ) {
				unset( $data[ $key ] );
			}
		}

		// Populate values of any missing attributes for which the block type
		// defines a default.
		$missing_schema_data = array_diff_key( $theme_properties_schema, $data );
		foreach ( $missing_schema_data as $key => $schema ) {
			if ( isset( $schema['default'] ) ) {
				$data[ $key ] = $schema['default'];
			}
		}

		return $data;
	}
}

QF_Meta_Fields_Factory::get_instance()->register( new QF_Theme_Meta_Field() );
