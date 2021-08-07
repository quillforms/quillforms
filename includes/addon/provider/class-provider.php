<?php
/**
 * Provider class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use QuillForms\Addon\Addon;
use QuillForms\Addon\Provider\API\API;

/**
 * Abstract class for provider plugin extensions.
 *
 * @since 1.3.0
 */
abstract class Provider extends Addon {

	/**
	 * Name
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Slug
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * API
	 *
	 * @var API
	 */
	public $api;

	/**
	 * Form data
	 *
	 * @var Form_Data
	 */
	public $form_data;

	/**
	 * API class name
	 *
	 * @var string
	 */
	protected static $api_class;

	/**
	 * REST class name
	 *
	 * @var string
	 */
	protected static $rest_class;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 */
	protected function __construct() {
		parent::__construct();

		$this->form_data = new Form_Data( $this->slug );
		$this->api = new static::$api_class( $this ); // phpcs:ignore
		new static::$rest_class( $this ); // phpcs:ignore
	}

}
