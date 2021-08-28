<?php
/**
 * Class: Addons_Manager
 *
 * @package QuillForms
 * @since 1.0.0
 */

namespace QuillForms\Managers;

use Exception;
use QuillForms\Addon\Addon;

/**
 * Addons_Manager class.
 *
 * @since 1.0.0
 */
final class Addons_Manager {

	/**
	 * Registered addons
	 *
	 * @var Addon[]
	 */
	private $registered = array();

	/**
	 * Class instance.
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance.
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
	 * Register addon
	 *
	 * @param Addon $addon Addon instance.
	 * @throws Exception Exception when slug exists.
	 * @return void
	 */
	public function register( $addon ) {
		if ( isset( $this->registered[ $addon->slug ] ) ) {
			throw new Exception( 'Cannot register an addon with existing slug.' );
		}
		$this->registered[ $addon->slug ] = $addon;
	}

	/**
	 * Get all registered
	 *
	 * @return array associative array of `$addon_slug => $addon` pairs
	 */
	public function get_all_registered() {
		return $this->registered;
	}

	/**
	 * Get registered addon
	 *
	 * @param string $slug Addon slug.
	 * @return Addon|null
	 */
	public function get_registered( $slug ) {
		return $this->registered[ $slug ] ?? null;
	}

	/**
	 * Get registered addon by namespace
	 *
	 * @param string $namespace Main namespace of addon.
	 * @return Addon|null
	 */
	public function get_registered_by_namespace( $namespace ) {
		foreach ( $this->registered as $addon ) {
			if ( $addon->get_namespace() === $namespace ) {
				return $addon;
			}
		}
		return null;
	}

}
