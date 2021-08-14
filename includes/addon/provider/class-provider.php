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
	protected static $classes = array(
		// + classes from parent.
		// 'api'           => API\API::class,
		// 'form_data'     => Form_Data::class,
		// 'rest'          => REST\REST::class,
		// 'entry_process' => Entry_Process::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 */
	protected function __construct() {
		parent::__construct();

		$this->form_data = new static::$classes['form_data']( $this->slug );
		$this->api       = new static::$classes['api']( $this );
		new static::$classes['rest']( $this );
		new static::$classes['entry_process']( $this );
	}

}
