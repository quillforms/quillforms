<?php
/**
 * Class Tasks
 *
 * @since 1.5.0
 * @package QuillForms
 */

namespace QuillForms;

use Throwable;

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
	 * Initialized
	 *
	 * @var boolean
	 */
	private static $initialized = false;

	/**
	 * Constructor.
	 *
	 * @since 1.5.0
	 *
	 * @param string $group Group.
	 */
	public function __construct( $group ) {
		if ( ! self::$initialized ) {
			self::initialize();
		}

		$this->group = $group;
	}

	/**
	 * Initialize
	 *
	 * @return void
	 */
	private static function initialize() {
		self::$initialized = true;
		add_action(
			'action_scheduler_deleted_action',
			function( $action_id ) {
				self::delete_meta( array( 'action_id' => $action_id ) );
			}
		);
	}

	/**
	 * Get the next timestamp for a scheduled action
	 *
	 * @since 1.6.0
	 *
	 * @param string     $hook Hook name.
	 * @param array|null $args Args passed to hook.
	 * @return integer|false False if not scheduled
	 */
	public function get_next_timestamp( $hook, $args = null ) {
		return as_next_scheduled_action( "{$this->group}_$hook", $args, $this->group );
	}

	/**
	 * Enqueue async task
	 * Must be called after 'init' action
	 *
	 * @param string $hook Hook name.
	 * @param array  ...$args Args passed to hook.
	 * @return integer|false
	 */
	public function enqueue_async( $hook, ...$args ) {
		// add args meta.
		$meta_id = $this->add_meta( "{$this->group}_$hook", $args );
		if ( ! $meta_id ) {
			return false;
		}

		// add action.
		$action_id = as_enqueue_async_action( "{$this->group}_$hook", compact( 'meta_id' ), $this->group );
		if ( ! $action_id ) {
			// Until scheduling succeeds no action owns this row, and the
			// action_scheduler_deleted_action cleanup is keyed on action id, so
			// leaving it here would orphan it permanently.
			self::delete_meta( array( 'ID' => $meta_id ) );
			return false;
		}

		// assign action to meta.
		$this->update_meta( $meta_id, array( 'action_id' => $action_id ), '%d' );

		return $action_id;
	}

	/**
	 * Schedule recurring task
	 *
	 * @since 1.6.0
	 *
	 * @param integer $timestamp Timestamp of run.
	 * @param string  $hook Hook name.
	 * @param array   ...$args Args passed to hook.
	 * @return integer|false
	 */
	public function schedule_single( $timestamp, $hook, ...$args ) {
		// add args meta.
		$meta_id = $this->add_meta( "{$this->group}_$hook", $args );
		if ( ! $meta_id ) {
			return false;
		}

		// add action.
		$action_id = as_schedule_single_action( $timestamp, "{$this->group}_$hook", compact( 'meta_id' ), $this->group );
		if ( ! $action_id ) {
			// Until scheduling succeeds no action owns this row, and the
			// action_scheduler_deleted_action cleanup is keyed on action id, so
			// leaving it here would orphan it permanently.
			self::delete_meta( array( 'ID' => $meta_id ) );
			return false;
		}

		// assign action to meta.
		$this->update_meta( $meta_id, array( 'action_id' => $action_id ), '%d' );

		return $action_id;
	}

	/**
	 * Schedule recurring task
	 *
	 * @since 1.6.0
	 *
	 * @param integer $timestamp Timestamp of first run.
	 * @param integer $interval Interval in seconds.
	 * @param string  $hook Hook name.
	 * @param array   ...$args Args passed to hook.
	 * @return integer|false
	 */
	public function schedule_recurring( $timestamp, $interval, $hook, ...$args ) {
		$full_hook = "{$this->group}_$hook";

		// A recurring action keeps running against the same meta row, and its
		// action id changes on every run, so the row cannot be cleaned up via
		// action_scheduler_deleted_action the way single/async tasks are.
		// Reuse the existing row for this hook instead of inserting a new one:
		// inserting per call leaked a permanently orphaned row every time
		// scheduling was attempted while the action was not currently scheduled.
		$meta_id     = $this->get_recurring_meta_id( $full_hook, $args );
		$reused_meta = (bool) $meta_id;

		if ( ! $meta_id ) {
			$meta_id = $this->add_meta( $full_hook, $args );
			if ( ! $meta_id ) {
				return false;
			}
		}

		$action_id = as_schedule_recurring_action( $timestamp, $interval, $full_hook, compact( 'meta_id' ), $this->group );

		if ( ! $action_id ) {
			// A row we just inserted is not owned by any action, so drop it
			// again. A reused row is left alone: its action is still scheduled.
			if ( ! $reused_meta ) {
				self::delete_meta( array( 'ID' => $meta_id ) );
			}
			return false;
		}

		return $action_id;
	}

	/**
	 * Find the meta row already in use by a recurring hook.
	 *
	 * Recurring tasks reuse a single meta row, keyed by hook, group and args
	 * rather than by action id.
	 *
	 * @since 5.7.3
	 *
	 * @param string $full_hook Hook name including the group prefix.
	 * @param array  $args Args passed to the hook.
	 * @return integer|null
	 */
	private function get_recurring_meta_id( $full_hook, $args ) {
		global $wpdb;

		$meta_id = $wpdb->get_var(
			$wpdb->prepare(
				"
					SELECT ID
					FROM {$wpdb->prefix}quillforms_task_meta
					WHERE hook = %s AND group_slug = %s AND value = %s
					ORDER BY ID ASC
					LIMIT 1
				",
				$full_hook,
				$this->group,
				maybe_serialize( $args )
			)
		);

		return $meta_id ? (int) $meta_id : null;
	}

	/**
	 * Register callback
	 *
	 * @param string   $hook Hook name.
	 * @param callable $callback The callback to be run when the action is called.
	 * @return void
	 */
	public function register_callback( $hook, $callback ) {
		add_action(
			"{$this->group}_$hook",
			function( $meta_id ) use ( $hook, $callback ) {
				quillforms_get_logger()->debug( "Start processing 'as' task '{$this->group}_$hook'" );
				$meta = $this->get_meta( $meta_id );
				if ( ! isset( $meta['value'] ) ) {
					quillforms_get_logger()->critical(
						esc_html__( 'Cannot find task meta', 'quillforms' ),
						array(
							'code'    => 'cannot_find_task_meta',
							'hook'    => $hook,
							'group'   => $this->group,
							'meta_id' => $meta_id,
						)
					);
					return;
				}
				try {
					quillforms_get_logger()->debug( "Processing 'as' task.", compact( 'meta' ) );
					call_user_func_array( $callback, $meta['value'] );
				} catch ( Throwable $e ) {
					quillforms_get_logger()->error(
						esc_html__( 'Task threw an exception', 'quillforms' ),
						array(
							'code'      => 'task_threw_exception',
							'hook'      => $hook,
							'group'     => $this->group,
							'exception' => array(
								'code'    => $e->getCode(),
								'message' => $e->getMessage(),
								'trace'   => $e->getTraceAsString(),
							),
						)
					);
				}
			}
		);
	}

	/**
	 * Add meta
	 *
	 * @param string $hook Hook.
	 * @param mixed  $value Value.
	 * @return integer|false
	 */
	private function add_meta( $hook, $value ) {
		global $wpdb;

		$insert = $wpdb->insert(
			"{$wpdb->prefix}quillforms_task_meta",
			array(
				'hook'         => $hook,
				'group_slug'   => $this->group,
				'value'        => maybe_serialize( $value ),
				'date_created' => gmdate( 'Y-m-d H:i:s' ),
			)
		);

		if ( ! $insert ) {
			quillforms_get_logger()->alert(
				'Cannot insert task meta',
				array(
					'hook'  => $hook,
					'group' => $this->group,
					'value' => $value,
				)
			);
			return false;
		}

		return $wpdb->insert_id;
	}

	/**
	 * Update meta
	 *
	 * @param integer      $id Meta id.
	 * @param array        $data Data to be updated.
	 * @param string|array $data_format Data format.
	 * @return boolean
	 */
	private function update_meta( $id, $data, $data_format = '%s' ) {
		global $wpdb;

		return (bool) $wpdb->update( "{$wpdb->prefix}quillforms_task_meta", $data, array( 'ID' => $id ), $data_format, array( '%d' ) );
	}

	/**
	 * Get meta
	 *
	 * @param integer $id Meta id.
	 * @return array
	 */
	private function get_meta( $id ) {
		global $wpdb;

		$meta = $wpdb->get_row(
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_task_meta
					WHERE ID = %d
				",
				$id
			),
			ARRAY_A
		);

		if ( ! empty( $meta['value'] ) ) {
			$meta['value'] = maybe_unserialize( $meta['value'] );
		}

		return $meta;
	}

	/**
	 * Delete meta
	 *
	 * @param array $where Where.
	 * @return boolean
	 */
	private static function delete_meta( $where ) {
		global $wpdb;

		return (bool) $wpdb->delete(
			"{$wpdb->prefix}quillforms_task_meta",
			$where
		);
	}

}
