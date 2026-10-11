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
	 * Rows handled per cleanup query.
	 *
	 * @since 5.7.4
	 */
	const CLEANUP_BATCH_SIZE = 500;

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

				// The meta of a one-off task holds a full copy of the entry and form
				// and is never read again. Recurring tasks reuse theirs on every run,
				// and only their meta has no action id.
				self::delete_finished_task_meta( $meta_id );
			}
		);
	}

	// phpcs:disable WordPress.DB.PreparedSQL -- Table names come from $wpdb->prefix and id lists are cast to integers.

	/**
	 * Delete finished QuillForms tasks
	 *
	 * Action Scheduler deletes completed and canceled actions a few at a time and
	 * keeps failed ones forever, with their logs and task meta. This deletes the
	 * actions of QuillForms and its addons that finished before the retention period,
	 * with their logs and meta, and task meta no action uses. Actions of other
	 * plugins are never touched.
	 *
	 * @since 5.7.4
	 *
	 * @param integer $time_budget Seconds to spend before stopping.
	 * @return boolean Whether rows are left to delete.
	 */
	public static function cleanup( $time_budget = 20 ) {
		global $wpdb;

		$actions_table = "{$wpdb->prefix}actionscheduler_actions";
		$logs_table    = "{$wpdb->prefix}actionscheduler_logs";
		$meta_table    = "{$wpdb->prefix}quillforms_task_meta";
		$deadline      = microtime( true ) + $time_budget;

		// Sites still on Action Scheduler's posts store have no actions table.
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $actions_table ) ) !== $actions_table ) {
			return false;
		}

		// The plugin uses the group "quillforms", addons "quillforms_{slug}" and entry exports "quillforms-export".
		$group_ids = array_map(
			'intval',
			$wpdb->get_col(
				$wpdb->prepare(
					"SELECT group_id FROM {$wpdb->prefix}actionscheduler_groups WHERE slug = %s OR slug LIKE %s OR slug LIKE %s",
					'quillforms',
					$wpdb->esc_like( 'quillforms_' ) . '%',
					$wpdb->esc_like( 'quillforms-' ) . '%'
				)
			)
		);

		// Same retention Action Scheduler uses for completed actions.
		$cutoff = gmdate( 'Y-m-d H:i:s', time() - (int) apply_filters( 'action_scheduler_retention_period', MONTH_IN_SECONDS ) );

		while ( $group_ids ) {
			$action_ids = $wpdb->get_col(
				$wpdb->prepare(
					'SELECT action_id FROM ' . $actions_table . '
					WHERE group_id IN (' . implode( ',', $group_ids ) . ')
						AND status IN (%s, %s, %s)
						AND scheduled_date_gmt < %s AND last_attempt_gmt < %s
					LIMIT %d',
					'complete',
					'failed',
					'canceled',
					$cutoff,
					$cutoff,
					self::CLEANUP_BATCH_SIZE
				)
			);
			if ( ! $action_ids ) {
				break;
			}

			$in = implode( ',', array_map( 'intval', $action_ids ) );
			$wpdb->query( "DELETE FROM {$logs_table} WHERE action_id IN ({$in})" );
			$wpdb->query( "DELETE FROM {$meta_table} WHERE action_id IN ({$in})" );
			$wpdb->query( "DELETE FROM {$actions_table} WHERE action_id IN ({$in})" );

			if ( microtime( true ) >= $deadline ) {
				return true;
			}
		}

		return self::cleanup_unused_meta( $actions_table, $meta_table, $deadline );
	}

	/**
	 * Delete task meta no action uses
	 *
	 * That is meta whose action is gone, and meta without an action id, which
	 * recurring tasks use and older versions left behind on every scheduling
	 * attempt, unless an action still passes it to its callback. Meta added in the
	 * last day is skipped, as its action may be being scheduled right now.
	 *
	 * @since 5.7.4
	 *
	 * @param string $actions_table Actions table.
	 * @param string $meta_table    Task meta table.
	 * @param float  $deadline      Time to stop at.
	 * @return boolean Whether rows are left to delete.
	 */
	private static function cleanup_unused_meta( $actions_table, $meta_table, $deadline ) {
		global $wpdb;

		$unused = $wpdb->prepare(
			"FROM {$meta_table} AS meta
			LEFT JOIN {$actions_table} AS actions ON actions.action_id = meta.action_id
			WHERE actions.action_id IS NULL AND meta.date_created < %s",
			gmdate( 'Y-m-d H:i:s', time() - DAY_IN_SECONDS )
		);

		// Meta ids still passed to callbacks, by actions of the hooks that have unused meta.
		$hooks = $wpdb->get_col( "SELECT DISTINCT meta.hook {$unused}" );
		if ( ! $hooks ) {
			return false;
		}
		$in_use = array();
		$args   = $wpdb->get_col(
			$wpdb->prepare(
				'SELECT COALESCE(extended_args, args) FROM ' . $actions_table . ' WHERE hook IN (' . implode( ',', array_fill( 0, count( $hooks ), '%s' ) ) . ')',
				$hooks
			)
		);
		foreach ( $args as $json ) {
			$decoded = json_decode( $json, true );
			if ( isset( $decoded['meta_id'] ) ) {
				$in_use[ (int) $decoded['meta_id'] ] = true;
			}
		}
		unset( $args );

		$last_id = 0;
		do {
			$ids = array_map( 'intval', $wpdb->get_col( $wpdb->prepare( "SELECT meta.ID {$unused} AND meta.ID > %d ORDER BY meta.ID LIMIT %d", $last_id, self::CLEANUP_BATCH_SIZE ) ) );
			if ( ! $ids ) {
				return false;
			}
			$last_id = end( $ids );

			$delete = array_filter(
				$ids,
				function( $id ) use ( $in_use ) {
					return ! isset( $in_use[ $id ] );
				}
			);
			if ( $delete ) {
				$wpdb->query( "DELETE FROM {$meta_table} WHERE ID IN (" . implode( ',', $delete ) . ')' );
			}
		} while ( microtime( true ) < $deadline );

		return true;
	}

	// phpcs:enable WordPress.DB.PreparedSQL

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

	/**
	 * Delete the meta of a one-off task after it ran
	 *
	 * @since 5.7.4
	 *
	 * @param integer $meta_id Meta id.
	 * @return void
	 */
	private static function delete_finished_task_meta( $meta_id ) {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}quillforms_task_meta WHERE ID = %d AND action_id IS NOT NULL",
				$meta_id
			)
		);
	}

}
