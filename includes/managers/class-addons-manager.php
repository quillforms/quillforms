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

	const NOT_ADDON_INSTANCE         = 1;
	const EMPTY_SLUG                 = 2;
	const DISALLOWED_SLUG_CHARACTERS = 3;
	const PRESERVED_STORE_ADDON_SLUG = 4;
	const ALREADY_USED_SLUG          = 5;
	const INCOMPATIBLE_DEPENDENCIES  = 6;
	const INCOMPATIBLE_VERSION       = 7;

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
			throw new Exception(
				sprintf( '%s object is not instance of %s', get_class( $addon ), Addon::class ),
				self::NOT_ADDON_INSTANCE
			);
		}
		// empty slug.
		if ( empty( $addon->slug ) ) {
			throw new Exception(
				sprintf( '%s addon slug is empty', get_class( $addon ) ),
				self::EMPTY_SLUG
			);
		}
		// disallowed slug characters.
		if ( ! preg_match( '/^[a-z0-9_-]+$/', $addon->slug ) ) {
			throw new Exception(
				sprintf( '%s addon slug has illegal characters (only a-z0-9 is allowed)', get_class( $addon ) ),
				self::DISALLOWED_SLUG_CHARACTERS
			);
		}
		$store_addon = Store::instance()->get_addon( $addon->slug );
		// preserved store addon slug.
		if ( $store_addon && $store_addon['full_plugin_file'] !== $addon->plugin_file ) {
			quillforms_get_logger()->debug(
				sprintf( 'Exception?: "%s" addon slug is preserved for Quillforms.com store addons.', $addon->slug ),
				array(
					'store_full_plugin_file' => $store_addon['full_plugin_file'],
					'plugin_file'            => $addon->plugin_file,
				)
			);
		}
		// already used slug.
		if ( isset( $this->registered[ $addon->slug ] ) ) {
			throw new Exception(
				sprintf( '%s addon slug is already used for %s', $addon->slug, get_class( $this->registered[ $addon->slug ] ) ),
				self::ALREADY_USED_SLUG
			);
		}
		// incompatible version.
		if ( $store_addon && ( $store_addon['min_version'] ?? null ) && version_compare( $store_addon['version'], $store_addon['min_version'], '<' ) ) {
			throw new Exception(
				sprintf( 'Quill Forms %s addon must be updated', $addon->slug ),
				self::INCOMPATIBLE_VERSION
			);
		}
		// incompatible dependencies.
		foreach ( $addon->dependencies ?? array() as $key => $value ) {
			if ( 'quillforms' === $key ) {
				if ( version_compare( QUILLFORMS_VERSION, $value['version'], '<' ) ) {
					throw new Exception(
						sprintf( '%s addon requires at least Quill Forms plugin version %s', $addon->slug, $value['version'] ),
						self::INCOMPATIBLE_DEPENDENCIES
					);
				}
			} elseif ( substr( $key, -6 ) === '_addon' ) {
				$dependency_addon_slug = substr( $key, 0, -6 );
				$dependency_addon      = $this->registered[ $dependency_addon_slug ] ?? null;
				if ( ( ! $dependency_addon && ( $value['required'] ?? false ) )
					|| ( $dependency_addon && version_compare( $dependency_addon->version, $value['version'], '<' ) ) ) {
						throw new Exception(
							sprintf( '%s addon requires at least %s addon version %s. please update it.', $addon->slug, $dependency_addon_slug, $value['version'] ),
							self::INCOMPATIBLE_DEPENDENCIES
						);
				}
			} elseif ( 'ssl' === $key ) {
				if ( ! $this->is_ssl() ) {
					throw new Exception(
						sprintf( '%s addon requires ssl', $addon->slug ),
						self::INCOMPATIBLE_DEPENDENCIES
					);
				}
			} elseif ( 'curl' === $key ) {
				if ( ! $this->is_curl_enabled() ) {
					throw new Exception(
						sprintf( '%s addon requires curl', $addon->slug ),
						self::INCOMPATIBLE_DEPENDENCIES
					);
				}
			} else {
				throw new Exception(
					sprintf( '%s addon has unknown dependency %s', $addon->slug, $key ),
					self::INCOMPATIBLE_DEPENDENCIES
				);
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

	/**
	 * Is ssl
	 *
	 * @since 1.8.0
	 *
	 * @return boolean
	 */
	private function is_ssl() {
		$is_ssl = is_ssl();

		// cloudflare flexible ssl.
		if ( ( json_decode( $_SERVER['HTTP_CF_VISITOR'] ?? '{}' )->scheme ?? null ) === 'https' ) {
			$is_ssl = true;
		}

		return apply_filters( 'quillforms_addon_manager_is_ssl', $is_ssl );
	}

	/**
	 * Is curl enabled
	 *
	 * @since 1.8.0
	 *
	 * @return boolean
	 */
	private function is_curl_enabled() {
		return function_exists( 'curl_version' ) || extension_loaded( 'curl' );
	}

}
