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
use QuillForms\Site\Store;

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
	 * Constructor
	 *
	 * @since 1.6.0
	 */
	private function __construct() {
	}

	/**
	 * Register addon
	 *
	 * @param Addon $addon Addon instance.
	 * @throws Exception Exception when slug exists.
	 * @return void
	 */
	public function register( $addon ) {
		if ( ! $addon instanceof Addon ) {
			throw new Exception( sprintf( '%s object is not instance of %s', get_class( $addon ), Addon::class ) );
		}
		// empty slug.
		if ( empty( $addon->slug ) ) {
			throw new Exception( sprintf( '%s addon slug is empty', get_class( $addon ) ) );
		}
		// disallowed slug characters.
		if ( ! preg_match( '/^[a-z0-9_-]+$/', $addon->slug ) ) {
			throw new Exception( sprintf( '%s addon slug has illegal characters (only a-z0-9 is allowed)', get_class( $addon ) ) );
		}
		// preserved store addon slug.
		$store_addon = Store::instance()->get_addon( $addon->slug );
		if ( $store_addon && $store_addon['full_plugin_file'] !== $addon->plugin_file ) {
			throw new Exception( sprintf( '"%s" addon slug is preserved for Quillforms.com store addons.', $addon->slug ) );
		}
		// already used slug.
		if ( isset( $this->registered[ $addon->slug ] ) ) {
			throw new Exception( sprintf( '%s addon slug is already used for %s', $addon->slug, get_class( $this->registered[ $addon->slug ] ) ) );
		}
		// incompatible dependencies.
		foreach ( $addon->dependencies ?? array() as $key => $value ) {
			if ( 'quillforms' === $key ) {
				if ( version_compare( QUILLFORMS_VERSION, $value['version'], '<' ) ) {
					throw new Exception( sprintf( '%s addon requires at least Quill Forms plugin version %s', $addon->slug, $value['version'] ) );
				}
			} elseif ( substr( $key, -6 ) === '_addon' ) {
				$dependency_addon_slug = substr( $key, 0, -6 );
				$dependency_addon      = $this->registered[ $dependency_addon_slug ] ?? null;
				if ( ! $dependency_addon || version_compare( $dependency_addon->version, $value['version'], '<' ) ) {
					throw new Exception( sprintf( '%s addon requires at least %s addon version %s', $addon->slug, $dependency_addon_slug, $value['version'] ) );
				}
			} else {
				throw new Exception( sprintf( '%s addon has unknown dependency %s', $addon->slug, $key ) );
			}
		}

		$this->registered[ $addon->slug ] = $addon;
	}

	/**
	 * Get all registered
	 *
	 * @return Addon[] associative array of `$addon_slug => $addon` pairs
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
