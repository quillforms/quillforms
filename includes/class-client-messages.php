<?php
/**
 * Client Messages: class Client_Messages
 *
 * @since 1.5.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Client_Messages Class
 *
 * @since 1.5.0
 */
class Client_Messages {

	/**
	 * Default messages
	 *
	 * @var array
	 */
	private $default_messages;

	/**
	 * Custom messages
	 *
	 * @var array
	 */
	private $custom_messages = array();

	/**
	 * Class instance
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
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
	 * @since 1.5.0
	 */
	private function __construct() {
		$this->set_default_messages();
	}

	/**
	 * Get messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public function get_messages() {
		return array_merge( $this->default_messages, $this->custom_messages );
	}

	/**
	 * Get custom messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public function get_custom_messages() {
		return $this->custom_messages;
	}

	/**
	 * Get default messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public function get_default_messages() {
		return $this->default_messages;
	}

	/**
	 * Add custom messages
	 *
	 * @param array $messages Custom messages to add.
	 * @return void
	 */
	public function add_custom_messages( $messages ) {
		$this->custom_messages = array_merge( $this->custom_messages, $messages );
	}

	/**
	 * Set default messages
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	private function set_default_messages() {
		$this->default_messages = json_decode(
			file_get_contents(
				QUILLFORMS_PLUGIN_DIR . 'includes/json/messages.json'
			),
			true
		);
	}

}
