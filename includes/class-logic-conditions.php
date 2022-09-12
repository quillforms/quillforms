<?php
/**
 * Class Logic_Conditions
 *
 * @since 1.13.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Logic_Conditions Class
 *
 * @since 1.13.0
 */
class Logic_Conditions {

	/**
	 * Types
	 *
	 * @since 1.13.0
	 *
	 * @var array type => args
	 */
	private $types = array();

	/**
	 * Class instance
	 *
	 * @since 1.13.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.13.0
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
	 * @since 1.13.0
	 */
	private function __construct() {
	}

	/**
	 * Register logic conditions type
	 *
	 * @since 1.13.0
	 *
	 * @param string $type Type.
	 * @param array  $args {
	 *      Type args.
	 *      @type callable $check Check callback accepts $modifier, $condition, $entry, $form_data.
	 * }
	 */
	public function register( $type, $args ) {
		if ( ! isset( $this->types[ $type ] ) && is_callable( $args['check'] ) ) {
			$this->types[ $type ] = $args;
		}
	}

	/**
	 * Is conditions met
	 *
	 * @since 1.13.0
	 *
	 * @param array $conditions Conditions.
	 * @param Entry $entry      Entry.
	 * @param array $form_data  Form data.
	 * @return boolean
	 */
	public function is_conditions_met( $conditions, $entry, $form_data ) {
		foreach ( $conditions as $conditions_group ) {
			if ( $this->is_group_conditions_met( $conditions_group, $entry, $form_data ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Is group conditions met
	 *
	 * @since 1.13.0
	 *
	 * @param array $conditions_group Conditions group.
	 * @param Entry $entry      Entry.
	 * @param array $form_data  Form data.
	 * @return boolean
	 */
	private function is_group_conditions_met( $conditions_group, $entry, $form_data ) {
		foreach ( $conditions_group as $condition ) {
			$type       = $condition['vars'][0]['type'];
			$modifier   = $condition['vars'][0]['value'];
			$_condition = array(
				'operator' => $condition['op'],
				'value'    => $condition['vars'][1]['value'],
			);
			if ( isset( $this->types[ $type ] ) ) {
				if ( ! $this->types[ $type ]['check']( $modifier, $_condition, $entry, $form_data ) ) {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get conditions schema
	 *
	 * @since 1.13.0
	 *
	 * @param boolean $required Required or not.
	 * @return array
	 */
	public static function get_conditions_schema( $required = false ) {
		return  array(
			'type'     => 'array',
			'required' => $required,
			'items'    => array(
				'type'  => 'array',
				'items' => array(
					'type'       => 'object',
					'properties' => array(
						'op'   => array(
							'type'     => 'string',
							'required' => true,
						),
						'vars' => array(
							'type'     => 'array',
							'required' => true,
						),
					),
				),
			),
		);
	}

	/**
	 * Check if value fullfilled the condition
	 *
	 * @since 1.13.0
	 *
	 * @param mixed $value     The field value.
	 * @param array $condition The condition array.
	 * @return bool
	 */
	public static function is_condition_fulfilled( $value, $condition ) {
		$condition_value = $condition['value'];
		switch ( $condition['operator'] ) {
			case 'is':
				if ( is_array( $value ) ) {
					return in_array( $condition_value, $value ); // phpcs:ignore
				}
				return ( $value == $condition_value ); // phpcs:ignore

			case 'is_not':
				if ( is_array( $value ) ) {
					return ! in_array( $condition_value, $value ); // phpcs:ignore
				}
				return ( $value != $condition_value ); // phpcs:ignore

			case 'greater_than':
				if ( ! is_numeric( $condition_value ) || ! is_numeric( $value ) ) {
					return false;
				}
				return (float) $value > (float) $condition_value;

			case 'lower_than':
				if ( ! is_numeric( $condition_value ) || ! is_numeric( $value ) ) {
					return false;
				}
				return (float) $value < (float) $condition_value;

			case 'contains':
				return strpos( $value, $condition_value ) !== false;

			case 'not_contains':
				return strpos( $value, $condition_value ) === false;

			case 'starts_with':
				if ( strlen( $condition_value ) > strlen( $value ) ) {
					return false;
				}
				return substr_compare( $value, $condition_value, 0, strlen( $condition_value ) ) === 0;

			case 'ends_with':
				if ( strlen( $condition_value ) > strlen( $value ) ) {
					return false;
				}
				return substr_compare( $value, $condition_value, -strlen( $condition_value ) ) === 0;

			default:
				return false;
		}
	}

}
