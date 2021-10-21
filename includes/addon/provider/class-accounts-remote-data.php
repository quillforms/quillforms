<?php
/**
 * Accounts_Remote_Data class.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use WP_Error;

/**
 * Accounts_Remote_Data class.
 *
 * @since 1.6.0
 */
abstract class Accounts_Remote_Data {

	/**
	 * Provider
	 *
	 * @since 1.6.0
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Cache key
	 *
	 * @since 1.6.0
	 *
	 * @var string
	 */
	protected $cache_key;

	/**
	 * Cache expiration in seconds
	 *
	 * @since 1.6.0
	 *
	 * @var integer
	 */
	protected $cache_expiration = 10 * 60;

	/**
	 * Constructor.
	 *
	 * @since 1.6.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider  = $provider;
		$this->cache_key = "provider_{$provider->slug}_accounts_remote_data";
	}

	/**
	 * Get data
	 *
	 * @since 1.6.0
	 *
	 * @param string  $account_id Account id.
	 * @param boolean $force_live Force live fetch.
	 * @return array|WP_Error
	 */
	public function get( $account_id, $force_live = false ) {
		$cache = $this->get_cache( $account_id );
		if ( $force_live || ! $cache
			|| $this->provider->version !== $cache['version']
			|| time() > $cache['timestamp'] + $this->cache_expiration ) {
			// fetch live data.
			$data = $this->fetch( $account_id );
			if ( ! is_wp_error( $data ) ) {
				$this->update_cache( $account_id, $data );
			}
		} else {
			// use cached data.
			$data = $cache['data'];
		}
		return $data;
	}

	/**
	 * Fetch data
	 *
	 * @since 1.6.0
	 *
	 * @param string $account_id Account id.
	 * @return array|WP_Error
	 */
	abstract protected function fetch( $account_id );

	/**
	 * Get cached data
	 *
	 * @since 1.6.0
	 *
	 * @param string $account_id Account id.
	 * @return array|null Array of data & timestamp on success, null on failure.
	 */
	public function get_cache( $account_id ) {
		$cache = get_option( $this->cache_key, array() );
		return $cache[ $account_id ] ?? null;
	}

	/**
	 * Update cached data
	 *
	 * @since 1.6.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $data Data.
	 * @return boolean
	 */
	protected function update_cache( $account_id, $data ) {
		$cache                = get_option( $this->cache_key, array() );
		$cache[ $account_id ] = array(
			'data'      => $data,
			'timestamp' => time(),
			'version'   => $this->provider->version,
		);
		return update_option( $this->cache_key, $cache );
	}

	/**
	 * Clear cached data
	 *
	 * @since 1.6.0
	 *
	 * @param string $account_id Account id.
	 * @return boolean
	 */
	public function clear_cache( $account_id ) {
		$cache = get_option( $this->cache_key, array() );
		if ( isset( $cache[ $account_id ] ) ) {
			unset( $cache[ $account_id ] );
			return update_option( $this->cache_key, $cache );
		}
		return true;
	}

}
