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
	 * Class names
	 *
	 * @var array
	 */
	protected static $provider_classes = array(
		'api'           => null,
		'rest'          => null,
		'entry_process' => null,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 */
	protected function __construct() {
		parent::__construct();

		$this->form_data = new Form_Data( $this->slug );
		$this->api       = new static::$provider_classes['api']( $this );
		new static::$provider_classes['rest']( $this );
		new static::$provider_classes['entry_process']( $this );
	}

}
