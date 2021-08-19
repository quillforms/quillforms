<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Addon\REST\REST as Abstract_REST;

/**
 * REST abstract class.
 *
 * @since 1.3.0
 */
abstract class REST extends Abstract_REST {

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
		// 'account_controller' => Account_Controller::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		parent::__construct( $addon );

		new static::$classes['account_controller']( $this->addon );
		add_filter( 'rest_prepare_quill_forms', array( $this, 'add_form_data' ), 10, 3 ); // uncomment at subclass if needed.
	}

}
