<?php
/**
 * Class Tasks
 *
 * @since 1.5.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Tasks class
 */
class Tasks {

	/**
	 * Group
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	private $group;

	/**
	 * Constructor.
	 *
	 * @since 1.5.0
	 *
	 * @param string $group Group.
	 */
	public function __construct( $group ) {
		$this->group = $group;
	}

	/**
	 * Enqueue async task
	 * Must be called after 'init' action
	 *
	 * @param string $hook Hook name.
	 * @param array  $args Args passed to hook.
	 * @return integer
	 */
	public function enqueue_async( $hook, $args ) {
		return as_enqueue_async_action( "{$this->group}_$hook", $args, $this->group );
	}

	/**
	 * Register callback
	 *
	 * @param string   $hook Hook name.
	 * @param callable $callback The callback to be run when the action is called.
	 * @param integer  $accepted_args Args number passed to the hook.
	 * @return void
	 */
	public function register_callback( $hook, $callback, $accepted_args = 1 ) {
		add_action( "{$this->group}_$hook", $callback, 10, $accepted_args );
	}

}
