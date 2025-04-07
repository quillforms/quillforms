<?php
/**
 * Class Entry
 *
 * @since next.version
 * @package QuillForms
 */

namespace QuillForms\Entries;

use QuillForms\Entry as Abstract_Entry;
use QuillForms\Entry_Record_Types;

/**
 * Entry class
 *
 * @since next.version
 */
class Entry extends Abstract_Entry {

	/**
	 * Is Starred
	 *
	 * @since next.version
	 *
	 * @var int
	 */
	public $is_starred;

	/**
	 * Is read
	 *
	 * @since next.version
	 *
	 * @var int
	 */
	public $is_read;

	/**
	 * Status
	 *
	 * @since 3.6.4
	 *
	 * @var string
	 */
	public $status;

	/**
 	* Hash id
	*
	* @since 3.6.4
	*
	* @var string|null
	*/
	public $hash_id;

	/**
	 * Instance properties that can be updated
	 *
	 * @since next.version
	 *
	 * @var array
	 */
	protected static $updatables = array(
		'form_id'      => 'intval',
		'is_starred'   => 'intval',
		'is_read'      => 'intval',
		'status'       => 'strval',
		'date_created' => 'strval',
		'date_updated' => 'strval',
	);

	/**
	 * Update instance updatables properties
	 *
	 * @since next.version
	 *
	 * @param object|array $properties Instance properties.
	 * @return void
	 */
	public function update_properties( $properties ) {
		foreach ( $properties as $key => $value ) {
			if ( isset( self::$updatables[ $key ] ) ) {
				$this->$key = self::$updatables[ $key ]( $value );
			}
		}
	}

	/**
	 * Load from database
	 * This method doesn't load records or meta.
	 *
	 * @since next.version
	 *
	 * @param integer $id Entry ID.
	 * @return boolean
	 */
	public function load( $id, $load_records = false, $load_meta = false ) {
		global $wpdb;

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_entries
					WHERE ID = %d
				",
				$id
			),
			ARRAY_A
		);

		quillforms_get_logger()->info( 'Load entry', array( 'id' => $id, 'result' => $result ) );
		if ( ! $result ) {
			return false;
		}

		$this->ID = (int) $id;
		$this->update_properties( $result );
		$this->records = null;
		$this->meta    = null;

		if( $load_records ) {
			$this->load_records();
			quillforms_get_logger()->info( 'Load entry records', array( 'id' => $id, 'entry' => $this ) );

		}
		if( $load_meta ) {
			$this->load_meta();
		}
		return true;
	}

	/**
	 * Load records from db
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	public function load_records() {
		global $wpdb;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"
					SELECT record_type, record_id, record_value
					FROM {$wpdb->prefix}quillforms_entry_records
					WHERE entry_id = %d
				",
				$this->ID
			),
			ARRAY_A
		);

		$this->records = array();
		foreach ( $results as $index => $result ) {
			list( $record_type, $record_id, $record_value ) = array_values( $result );
			if ( Entry_Record_Types::instance()->get( $record_type ) ) {
				$this->records[ Entry_Record_Types::instance()->get( $record_type )['section'] ][ $record_id ] = array(
					'value' => maybe_unserialize( $record_value ),
				);
			}
			unset( $results[ $index ] );
		}
	}

	/**
	 * Load meta from database
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	public function load_meta() {
		global $wpdb;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"
					SELECT meta_key,meta_value
					FROM {$wpdb->prefix}quillforms_entry_meta
					WHERE entry_id = %d
				",
				$this->ID
			),
			ARRAY_A
		);

		$this->meta = array();
		if ( $results ) {
			foreach ( $results as $result ) {
				$this->meta[ $result['meta_key'] ] = array(
					'value' => maybe_unserialize( $result['meta_value'] ),
				);
			}
		}
	}

	/**
	 * Load records if not loaded
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	public function ensure_records_load() {
		if ( $this->records === null ) {
			$this->load_records();
		}
	}

	/**
	 * Load meta if not loaded
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	public function ensure_meta_load() {
		if ( $this->meta === null ) {
			$this->load_meta();
		}
	}

	/**
	 * Generate hash key
	 *
	 * @return string
	 */
	public function generate_hash_key() {
		return md5( uniqid( rand(), true ) );
	}

	/**
	 * Insert
	 * Saves entry to the database
	 *
	 * @since next.version
	 *
	 * @return boolean
	 */
	public function insert() {
		global $wpdb;

		if ( $this->ID ) {
			return false;
		}

		// insert entry.
		$data = array(
			'hash_id' => $this->generate_hash_key(),
		);

		foreach ( self::$updatables as $property => $sanitize ) {
			if ( 'status' === $property && ! isset( $this->$property ) ) {
				$data[ $property ] = 'completed';
				continue;
			}
			$data[ $property ] = $sanitize( $this->$property );
		}
		$insert = $wpdb->insert( "{$wpdb->prefix}quillforms_entries", $data );
		if ( $insert ) {
			$this->ID      = $wpdb->insert_id;
			$this->hash_id = $data['hash_id'];
			$this->status  = $data['status'];
		} else {
			return false;
		}

		// insert records.
		foreach ( Entry_Record_Types::instance()->get_all() as $type => $args ) {
			foreach ( $this->records[ $args['section'] ] ?? array() as $record_id => $record_data ) {
				$this->insert_record( $type, $record_id, $record_data );
			}
		}

		// insert meta.
		foreach ( $this->meta as $meta_key => $meta_data ) {
			$this->insert_meta( $meta_key, $meta_data );
		}

		return true;
	}

	/**
	 * Update
	 *
	 * @since next.version
	 *
	 * @param array $data Entry data.
	 * @return boolean
	 */
	public function update( $data ) {
		global $wpdb;

		$data['date_updated'] = gmdate( 'Y-m-d H:i:s' );

		// db update.
		$updated = (bool) $wpdb->update( "{$wpdb->prefix}quillforms_entries", $data, array( 'ID' => $this->ID ) );

		// properties update.
		if ( $updated ) {
			$this->update_properties( $data );
		}

		return $updated;
	}

	/**
	 * Update Entry
	 *
	 * @since 1.4.0
	 *
	 * @param self $entry Entry.
	 *
	 * @return boolean
	 */
	public function update_entry( $entry ) {
		// Update entry.
		$updated = $this->update(
			array(
				'status' => $entry->status ?? 'completed',
			)
		);

		if ( ! $updated ) {
			return false;
		}

		// Update records.
		foreach ( Entry_Record_Types::instance()->get_all() as $type => $args ) {
			foreach ( $entry->records[ $args['section'] ] ?? array() as $record_id => $record_data ) {
				$record = $this->get_record_value( $type, $record_id );
				if ( $record ) {
					$this->update_record( $type, $record_id, $record_data );
				} else {
					$this->insert_record( $type, $record_id, $record_data );
				}
			}
		}

		// Update meta.
		foreach ( $entry->meta as $meta_key => $meta_data ) {
			$meta = $this->get_meta_value( $meta_key );
			if ( $meta ) {
				$this->update_meta( $meta_key, $meta_data );
			} else {
				$this->insert_meta( $meta_key, $meta_data );
			}
		}

		return true;
	}

	/**
	 * Delete
	 *
	 * @since next.version
	 *
	 * @return boolean
	 */
	public function delete() {
		global $wpdb;

		// db delete.
		$deleted = (bool) $wpdb->delete( "{$wpdb->prefix}quillforms_entries", array( 'ID' => $this->ID ) );

		// delete records.
		$wpdb->delete( "{$wpdb->prefix}quillforms_entry_records", array( 'entry_id' => $this->ID ) );

		// delete meta.
		$wpdb->delete( "{$wpdb->prefix}quillforms_entry_meta", array( 'entry_id' => $this->ID ) );

		return $deleted;
	}

	/**
	 * Insert entry record
	 *
	 * @since next.version
	 *
	 * @param string $record_type Record type.
	 * @param string $record_id Record key.
	 * @param array  $record_data Record data. Must includes 'value'.
	 * @return int|false record id or false if failed
	 */
	public function insert_record( $record_type, $record_id, $record_data ) {
		global $wpdb;

		$data   = array(
			'form_id'      => $this->form_id,
			'entry_id'     => $this->ID,
			'record_type'  => $record_type,
			'record_id'    => $record_id,
			'record_value' => maybe_serialize( $record_data['value'] ),
		);
		$format = array( '%d', '%d', '%s', '%s', '%s' );
		$insert = $wpdb->insert( "{$wpdb->prefix}quillforms_entry_records", $data, $format );

		if ( ! $insert ) {
			return false;
		}

		return $wpdb->insert_id;
	}

	/**
	 * Update entry record
	 *
	 * @since next.version
	 *
	 * @param string $record_type
	 * @param string $record_id
	 * @param array  $record_data Must includes value.
	 * @return boolean
	 */
	public function update_record( $record_type, $record_id, $record_data ) {
		global $wpdb;

		$data         = array(
			'record_value' => maybe_serialize( $record_data['value'] ),
		);
		$format       = array( '%s' );
		$where        = array(
			'entry_id'    => $this->ID,
			'record_type' => $record_type,
			'record_id'   => $record_id,
		);
		$where_format = array( '%d', '%s', '%s' );
		return (bool) $wpdb->update( "{$wpdb->prefix}quillforms_entry_records", $data, $where, $format, $where_format );
	}

	/**
	 * Insert entry meta
	 *
	 * @since next.version
	 *
	 * @param string $meta_key
	 * @param array  $meta_data Must include 'value'.
	 * @return int|false meta id or false if failed
	 */
	public function insert_meta( $meta_key, $meta_data ) {
		global $wpdb;

		$data   = array(
			'form_id'    => $this->form_id,
			'entry_id'   => $this->ID,
			'meta_key'   => $meta_key,
			'meta_value' => maybe_serialize( $meta_data['value'] ),
		);
		$format = array( '%d', '%d', '%s', '%s' );
		$insert = $wpdb->insert( "{$wpdb->prefix}quillforms_entry_meta", $data, $format );

		if ( ! $insert ) {
			return false;
		}

		return $wpdb->insert_id;
	}

	/**
	 * Update entry meta
	 *
	 * @since next.version
	 *
	 * @param string $meta_key
	 * @param array  $meta_data Must includes value.
	 * @return boolean
	 */
	public function update_meta( $meta_key, $meta_data ) {
		global $wpdb;

		$data         = array(
			'meta_value' => maybe_serialize( $meta_data['value'] ),
		);
		$format       = array( '%s' );
		$where        = array(
			'entry_id' => $this->ID,
			'meta_key' => $meta_key,
		);
		$where_format = array( '%d', '%s' );
		return (bool) $wpdb->update( "{$wpdb->prefix}quillforms_entry_meta", $data, $where, $format, $where_format );
	}

	/**
	 * Delete entry meta
	 *
	 * @since next.version
	 *
	 * @param string $meta_key
	 * @return boolean
	 */
	public function delete_meta( $meta_key ) {
		global $wpdb;

		$where        = array(
			'entry_id' => $this->ID,
			'meta_key' => $meta_key,
		);
		$where_format = array( '%d', '%s' );
		return (bool) $wpdb->delete( "{$wpdb->prefix}quillforms_entry_meta", $where, $where_format );
	}

	/**
	 * Get entry
	 *
	 * @since next.version
	 *
	 * @param int $id
	 * @return self|null
	 */
	public static function get( $id, $with_records = false, $with_meta = false ) {
		$instance = new self();
		$load     = $instance->load( $id, $with_records, $with_meta );
		return $load ? $instance : null;
	}

	/**
	 * Get entry by hash id
	 *
	 * @since 3.6.4
	 *
	 * @param string $hash_id Hash id.
	 * @param string $status Status.
	 *
	 * @return self|null
	 */
	public static function get_by_hash_id( $hash_id, $status = 'partial' ) {
		global $wpdb;

		if ( ! $hash_id ) {
			return null;
		}

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"
					SELECT ID
					FROM {$wpdb->prefix}quillforms_entries
					WHERE hash_id = %s AND status = %s
				",
				$hash_id,
				$status
			),
			ARRAY_A
		);

		quillforms_get_logger()->info( 'Get entry by hash id', array( 'hash_id' => $hash_id, 'result' => $result ) );

		if ( ! $result ) {
			return null;
		}

		return self::get( $result['ID'], true, true );
	}

	/**
	 * Get entry by meta
	 *
	 * @since next.version
	 *
	 * @param string  $meta_key
	 * @param string  $meta_value
	 * @param int     $form_id
	 * @param boolean $single
	 * @return self|array|null
	 */
	public static function get_by_meta( $meta_key, $meta_value, $form_id = null, $single = true ) {
		global $wpdb;

		$additional = '';
		if ( $form_id ) {
			$additional .= ' AND form_id = ' . absint( $form_id );
		}
		if ( $single ) {
			$additional .= ' LIMIT 1';
		}

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT entry_id
				 FROM {$wpdb->prefix}quillforms_entry_meta
				 WHERE meta_key = %s AND meta_value = %s $additional", // phpcs:ignore
				array( $meta_key, maybe_serialize( $meta_value ) )
			),
			ARRAY_A
		);

		if ( ! $results ) {
			return $single ? null : array();
		}

		$instances = array();
		foreach ( $results as $result ) {
			$instances[] = self::get( $result['entry_id'] );
		}

		return $single ? $instances[0] : $instances;
	}

	/**
	 * Get entry by record
	 *
	 * @since next.version
	 *
	 * @param string  $record_id
	 * @param mixed   $record_value
	 * @param int     $form_id
	 * @param boolean $single
	 * @return self|array|null
	 */
	public static function get_by_record( $record_id, $record_value, $form_id = null, $single = true ) {
		global $wpdb;

		$additional = '';
		if ( $form_id ) {
			$additional .= ' AND form_id = ' . absint( $form_id );
		}
		if ( $single ) {
			$additional .= ' LIMIT 1';
		}

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT entry_id
				 FROM {$wpdb->prefix}quillforms_entry_records
				 WHERE record_id = %s AND record_value = %s $additional", // phpcs:ignore
				array( $record_id, maybe_serialize( $record_value ) )
			),
			ARRAY_A
		);

		if ( ! $results ) {
			return $single ? null : array();
		}

		$instances = array();
		foreach ( $results as $result ) {
			$instances[] = self::get( $result['entry_id'] );
		}

		return $single ? $instances[0] : $instances;
	}

	/**
	 * Get specific entries
	 *
	 * @since next.version
	 *
	 * @param array $ids Ids of entries.
	 * @return self[]
	 */
	public static function get_many( $ids ) {
		global $wpdb;

		$ids_placeholder = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

		$results = $wpdb->get_results(
			// @codingStandardsIgnoreStart
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_entries
					WHERE ID IN ($ids_placeholder)
					ORDER BY ID DESC
				",
				$ids
			),
			// @codingStandardsIgnoreEnd
			ARRAY_A
		);

		$instances = array();
		foreach ( $results as $result ) {
			$instance     = new self();
			$instance->ID = (int) $result['ID'];
			$instance->update_properties( $result );
			$instances[] = $instance;
		}

		return $instances;
	}

	/**
	 * Get form entries
	 *
	 * @since next.version
	 *
	 * @param int    $form_id Form id.
	 * @param string $from From date.
	 * @param string $to To date.
	 * @param int    $offset Offset.
	 * @param int    $count Count.
	 * @param string $status Status.
	 * @return self[]
	 */
	public static function get_all( $form_id, $from, $to, $offset = 0, $count = 10000000, $status = null ) {
		global $wpdb;

		$from = self::convert_date( $from ) ?? '0000-00-00 00:00:00';
		$to   = self::convert_date( $to, '23:59:59' ) ?? '9999-12-31 23:59:59';

		$where_conditions = array( 'form_id = %d', 'date_created BETWEEN %s AND %s' );
		$prepare_args     = array( $form_id, $from, $to );

		if ( $status !== null ) {
			$where_conditions[] = 'status = %s';
			$prepare_args[]     = $status;
		}

		$where = implode( ' AND ', $where_conditions );

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_entries
					WHERE $where
					ORDER BY ID DESC
					LIMIT %d, %d
				",
				array_merge( $prepare_args, array( $offset, $count ) )
			),
			ARRAY_A
		);

		$instances = array();
		foreach ( $results as $result ) {
			$instance     = new self();
			$instance->ID = (int) $result['ID'];
			$instance->update_properties( $result );
			$instances[] = $instance;
		}

		return $instances;
	}

	/**
	 * Retrieves the count of entries for a specific form within a given date range.
	 *
	 * @param int    $form_id The ID of the form.
	 * @param string $from    The starting date of the range (in Y-m-d format).
	 * @param string $to      The ending date of the range (in Y-m-d format).
	 * @param bool   $is_read Whether to count only read entries.
	 *
	 * @return int The count of entries for the specified form within the given date range.
	 */
	public static function get_entries_count( $form_id, $from, $to, $is_read = null, $status = null ) {
		global $wpdb;

		$from = self::convert_date( $from ) ?? '0000-00-00 00:00:00';
		$to   = self::convert_date( $to, '23:59:59' ) ?? '9999-12-31 23:59:59';

		$where_conditions = array( 'form_id = %d', 'date_created BETWEEN %s AND %s' );
		$prepare_args     = array( $form_id, $from, $to );

		if ( $is_read !== null ) {
			$where_conditions[] = 'is_read = ' . ( $is_read ? '1' : '0' );
		}

		if ( $status !== null ) {
			$where_conditions[] = 'status = %s';
			$prepare_args[]     = $status;
		}

		$where = implode( ' AND ', $where_conditions );

		return (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}quillforms_entries WHERE $where", // phpcs:ignore
				$prepare_args
			)
		);
	}

	/**
	 * Retrieves entries from the database for a specific form within a date range.
	 *
	 * @param int    $form_id The ID of the form.
	 * @param string $from    The starting date of the range.
	 * @param string $to      The ending date of the range.
	 * @param int    $limit   The maximum number of entries to retrieve.
	 * @param int    $offset  The offset for pagination.
	 * @param string $status  The status of the entries to retrieve.
	 *
	 * @return array An array of instances of the "Entries" class representing the retrieved entries.
	 */
	public static function db_get_entries( $form_id, $from, $to, $limit, $offset, $status = null ) {
		global $wpdb;

		$from = self::convert_date( $from ) ?? '0000-00-00 00:00:00';
		$to   = self::convert_date( $to, '23:59:59' ) ?? '9999-12-31 23:59:59';

		$where_conditions = array( 'form_id = %d', 'date_created BETWEEN %s AND %s' );
		$prepare_args     = array( $form_id, $from, $to );

		if ( $status !== null ) {
			$where_conditions[] = 'status = %s';
			$prepare_args[]     = $status;
		}

		$prepare_args[] = $offset;
		$prepare_args[] = $limit;

		$where = implode( ' AND ', $where_conditions );

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_entries
					WHERE $where
					ORDER BY ID DESC
					LIMIT %d, %d
				",
				$prepare_args
			),
			ARRAY_A
		);

		$instances = array();

		foreach ( $results as $result ) {
			$instance     = new self();
			$instance->ID = (int) $result['ID'];
			$instance->update_properties( $result );
			$instances[] = $instance;
		}

		return $instances;
	}

	/**
	 * Delete all entries associated with a form
	 *
	 * @since next.version
	 *
	 * @param int $form_id Form id.
	 * @return boolean
	 */
	public static function delete_all( $form_id ) {
		global $wpdb;

		// delete entries.
		$deleted = (bool) $wpdb->delete( "{$wpdb->prefix}quillforms_entries", array( 'form_id' => $form_id ) );

		// delete records.
		$wpdb->delete( "{$wpdb->prefix}quillforms_entry_records", array( 'form_id' => $form_id ) );

		// delete meta.
		$wpdb->delete( "{$wpdb->prefix}quillforms_entry_meta", array( 'form_id' => $form_id ) );

		return $deleted;
	}

	/**
	 * Get entries count
	 *
	 * @since next.version
	 *
	 * @param int          $form_id Form id.
	 * @param boolean|null $is_read Null if not specified.
	 * @param string|null  $since Datetime in 'c' format or null.
	 * @param string|null  $status Status of the entry.
	 * @return int
	 */
	public static function get_count( $form_id, $is_read = null, $since = null, $status = null ) {
		global $wpdb;

		$where_conditions = array( 'form_id = %d' );
		$prepare_args     = array( $form_id );

		if ( $is_read !== null ) {
			$where_conditions[] = 'is_read = ' . ( $is_read ? '1' : '0' );
		}

		if ( $since !== null ) {
			$where_conditions[] = 'date_created >= %s';
			$prepare_args[]     = $since;
		}

		if ( $status !== null ) {
			$where_conditions[] = 'status = %s';
			$prepare_args[]     = $status;
		}

		$where = implode( ' AND ', $where_conditions );

		return (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}quillforms_entries WHERE $where", // phpcs:ignore
				$prepare_args
			)
		);
	}

	/**
	 * Converts a date string to the specified format.
	 *
	 * This method takes a date string and converts it to the format 'Y-m-d H:i:s'.
	 * It removes any parentheses and GMT information from the date string before converting it.
	 * If an error occurs during the conversion, null is returned.
	 *
	 * @param string $date_string The date string to be converted.
	 * @param string $custom_time The time to be used in the converted date string.
	 * @return string|null The converted date string in the format 'Y-m-d H:i:s', or null if an error occurs.
	 */
	public static function convert_date( $date_string, $custom_time = '00:00:00' ) {
		if ( ! $date_string ) {
			return null;
		}
		try {
			$date_string = preg_replace( '/\(.*\)/', '', $date_string );
			$date_string = preg_replace( '/ GMT.*/', '', $date_string );
			$date        = new \DateTime( $date_string );

			if ( $custom_time ) {
				$date->setTime( ...explode( ':', $custom_time ) );
			}

			return $date->format( 'Y-m-d H:i:s' );
		} catch ( \Throwable $th ) {
			return null;
		}
	}
}
