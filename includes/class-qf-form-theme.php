<?php
/**
 * Theme API: QF_Theme class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Quill Forms Thene.
 *
 * @since 1.0.0
 */
class QF_Form_Theme {

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Form_Theme|null
	 */
	private static $instance = null;

	/**
	 * Theme Data.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	public $data;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->data = $this->get_theme_data();
	}

	/**
	 * Get Theme Data.
	 *
	 * @since 1.0.0
	 *
	 * @return array The theme data array
	 */
	public function get_theme_data() {
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
	 * Validates theme data against the current theme schema, populating
	 * defaulted and missing values.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Optional. original theme data.
	 *
	 * @return array prepared block attributes
	 */
	public function prepare_theme_data_for_render( $data = array() ) {
		// If there are no attribute definitions for themn, skip
		// processing and return vebatim.
		if ( empty( $this->data ) ) {
			return $data;
		}

		foreach ( $data as $key => $value ) {
			// If the attribute is not defined by theme, it cannot be
			// validated.
			if ( ! isset( $this->data[ $key ] ) ) {
				continue;
			}

			$schema = $this->data[ $key ];

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
		$missing_schema_data = array_diff_key( $this->data, $data );
		foreach ( $missing_schema_data as $key => $schema ) {
			if ( isset( $schema['default'] ) ) {
				$data[ $key ] = $schema['default'];
			}
		}

		return $data;
	}

	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Form_Theme the main instance
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
