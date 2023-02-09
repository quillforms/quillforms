<?php
/**
 * Class Entry
 *
 * @since   1.10.0
 * @package QuillForms
 */

namespace QuillForms;

use ArrayAccess;
use Exception;

/**
 * Entry class
 *
 * @since 1.10.0
 */
class Entry implements ArrayAccess
{

    /**
     * ID
     *
     * @since 1.10.0
     *
     * @var int|null null if not saved.
     */
    public $ID;

    /**
     * Form id
     *
     * @since 1.10.0
     *
     * @var int
     */
    public $form_id;

    /**
     * Date created
     *
     * @since 1.10.0
     *
     * @var string GMT/UTC date/time with format 'Y-m-d H:i:s'.
     */
    public $date_created;

    /**
     * Date updated
     *
     * @since 1.10.0
     *
     * @var string GMT/UTC date/time with format 'Y-m-d H:i:s'.
     */
    public $date_updated;

    /**
     * Records
     * Format: [
     *      '{section}' => [ // section is like 'fields', 'variables', ...
     *          '{id}' => [
     *              'value' => {value}, // 'value' maybe directly unreadable and can need process.
     *          ]
     *      ],
     * ]
     *
     * @since 1.10.0
     *
     * @var array
     */
    public $records;

    /**
     * Meta
     * Format: [
     *     '{key}' => [
     *          {value}, // value is always readable.
     *      ]
     * ]
     *
     * @since 1.10.0
     *
     * @var array
     */
    public $meta;

    /**
     * Get record value
     *
     * @since 1.13.0
     *
     * @param  string $type Record type.
     * @param  string $id   Record id.
     * @return mixed
     */
    public function get_record_value( $type, $id )
    {
        $section = Entry_Record_Types::instance()->get($type)['section'];
        return $this->records[ $section ][ $id ]['value'] ?? null;
    }

    /**
     * Set record value
     *
     * @since 1.13.0
     *
     * @param  string $type  Record type.
     * @param  string $id    Record id.
     * @param  mixed  $value Record value.
     * @return void
     */
    public function set_record_value( $type, $id, $value )
    {
        $section                                   = Entry_Record_Types::instance()->get($type)['section'];
        $this->records[ $section ][ $id ]['value'] = $value;
    }

    /**
     * Get meta value
     *
     * @since 1.13.0
     *
     * @param  string $id Meta id.
     * @return mixed
     */
    public function get_meta_value( $id )
    {
        return $this->meta[ $id ]['value'] ?? null;
    }

    /**
     * Set meta value
     *
     * @since 1.13.0
     *
     * @param  string $id    Meta id.
     * @param  mixed  $value Meta value.
     * @return void
     */
    public function set_meta_value( $id, $value )
    {
        $this->meta[ $id ]['value'] = $value;
    }

    /**
     * Get readable records
     * Returns the same $this->records with 'readable_value' with each record
     *
     * @since 1.10.0
     *
     * @param  array|null $form_data The form data.
     * @param  string     $context   The context.
     * @return array
     */
    public function get_readable_records( $form_data, $context = 'html' )
    {
        $records = $this->records;
        foreach ( Entry_Record_Types::instance()->get_all() as $type => $arg ) {
            foreach ( array_keys($this->records[ $arg['section'] ] ?? array()) as $id ) {
                $records[ $arg['section'] ][ $id ]['readable_value'] = $this->get_record_readable_value($type, $id, $form_data, $context);
            }
        }
        return $records;
    }

    /**
     * Get record readable value
     *
     * @since 1.10.0
     *
     * @param  string $record_type Record type.
     * @param  string $record_id   Record id.
     * @param  array  $form_data   Form data.
     * @param  string $context     Context.
     * @return mixed
     */
    public function get_record_readable_value( $record_type, $record_id, $form_data, $context = 'html' )
    {
        $get_readable_value = Entry_Record_Types::instance()->get($record_type)['get_readable_value'] ?? null;
        if ($get_readable_value ) {
            return $get_readable_value($record_id, $this, $form_data, $context);
        } else {
            return $this->get_record_value($record_type, $record_id);
        }
    }

	// @codingStandardsIgnoreStart
	// ArrayAccess methods, used to get 'id' and 'form_id' from entry as an array for backwards compatibility
	public function offsetExists( $offset ): bool {
        return in_array( $offset, array( 'id', 'form_id' ), true );
	}
	public function offsetGet( $offset ) {
        switch ( $offset ) {
         case 'id':
          return $this->ID;
      case 'form_id':
          return $this->form_id;
      default:
          return null;
        }
	}
	public function offsetSet( $offset, $value ): void {
        throw new Exception( 'Not allowed to set object properties through array access.' );
	}
	public function offsetUnset( $offset ): void {
        throw new Exception( 'Not allowed to set object properties through array access.' );
	}
	// @codingStandardsIgnoreEnd

}
