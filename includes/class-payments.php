<?php
/**
 * Class: Payments
 *
 * @since next.version
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Payments Class
 *
 * @since next.version
 */
class Payments {

	/**
	 * Class instance
	 *
	 * @since next.version
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since next.version
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
	 * @since next.version
	 */
	private function __construct() {}

	/**
	 * Get currencies
	 *
	 * @since next.version
	 *
	 * @param string|array $properties Currencies properties to return. 'all' for all currencies.
	 * @return array
	 */
	public function get_currencies( $properties = 'all' ) {
		/**
		 * Filter available currencies
		 *
		 * @see https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/i18n/locale-info.php
		 */
		$currencies = apply_filters( 'quillforms_currencies', $this->get_default_currencies() );

		if ( 'all' === $properties ) {
			return $currencies;
		}

		return array_map(
			function( $currency ) use ( $properties ) {
				return array_filter(
					$currency,
					function( $property ) use ( $properties ) {
						return in_array( $property, $properties, true );
					},
					ARRAY_FILTER_USE_KEY
				);
			},
			$currencies
		);
	}

	/**
	 * Get currency symbol
	 *
	 * @since next.version
	 *
	 * @param string $code Currency code.
	 * @return string|null
	 */
	public function get_currency_symbol( $code ) {
		return $this->get_currencies()[ $code ]['symbol'] ?? null;
	}

	/**
	 * Format money
	 *
	 * @since next.version
	 *
	 * @param float  $value Value.
	 * @param string $currency Currency symbol.
	 * @param string $format Format left, left_space, right, right_space or custom string containing %c and %v.
	 * @return string
	 */
	public function format_money( $value, $currency, $format ) {
		switch ( $format ) {
			case 'left':
				$format = '%c%v';
				break;
			case 'left_space':
				$format = '%c %v';
				break;
			case 'right':
				$format = '%v%c';
				break;
			case 'right_space':
				$format = '%v %c';
				break;
		}
		return str_replace( array( '%c', '%v' ), array( $currency, $value ), $format );
	}

	/**
	 * Get default currencies
	 *
	 * @since next.version
	 *
	 * @return array
	 */
	private function get_default_currencies() {
		return array(
			'USD' => array(
				'name'         => 'United States (US) dollar',
				'singular'     => 'US dollar',
				'plural'       => 'US dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'EUR' => array(
				'name'         => 'Euro',
				'singular'     => 'euro',
				'plural'       => 'euros',
				'symbol'       => '€',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
			'GBP' => array(
				'name'         => 'Pound sterling',
				'singular'     => 'British pound',
				'plural'       => 'British pounds',
				'symbol'       => '£',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'AUD' => array(
				'name'         => 'Australian dollar',
				'singular'     => 'Australian dollar',
				'plural'       => 'Australian dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'BRL' => array(
				'name'         => 'Brazilian real',
				'singular'     => 'Brazilian real',
				'plural'       => 'Brazilian reals',
				'symbol'       => 'R$',
				'symbol_pos'   => 'left_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
			'CAD' => array(
				'name'         => 'Canadian dollar',
				'singular'     => 'Canadian dollar',
				'plural'       => 'Canadian dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'XAF' => array(
				'name'         => 'Central African CFA franc',
				'singular'     => 'Central African CFA franc',
				'plural'       => 'Central African CFA francs',
				'symbol'       => null,
				'symbol_pos'   => 'right_space',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'CLP' => array(
				'name'         => 'Chilean peso',
				'singular'     => 'Chilean peso',
				'plural'       => 'Chilean pesos',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
			'CNY' => array(
				'name'         => 'Chinese yuan',
				'singular'     => 'Chinese yuan',
				'plural'       => 'Chinese yuan',
				'symbol'       => '¥',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'CZK' => array(
				'name'         => 'Czech koruna',
				'singular'     => 'Czech koruna',
				'plural'       => 'Czech korunas',
				'symbol'       => 'Kč',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'DKK' => array(
				'name'         => 'Danish krone',
				'singular'     => 'Danish krone',
				'plural'       => 'Danish kroner',
				'symbol'       => 'kr',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
			'HKD' => array(
				'name'         => 'Hong Kong dollar',
				'singular'     => 'Hong Kong dollar',
				'plural'       => 'Hong Kong dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'HUF' => array(
				'name'         => 'Hungarian forint',
				'singular'     => 'Hungarian forint',
				'plural'       => 'Hungarian forints',
				'symbol'       => 'Ft',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'ILS' => array(
				'name'         => 'Israeli new shekel',
				'singular'     => 'Israeli new shekel',
				'plural'       => 'Israeli new shekels',
				'symbol'       => '₪',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'JPY' => array(
				'name'         => 'Japanese yen',
				'singular'     => 'Japanese yen',
				'plural'       => 'Japanese yen',
				'symbol'       => '¥',
				'symbol_pos'   => 'left',
				'num_decimals' => 0,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'MXN' => array(
				'name'         => 'Mexican peso',
				'singular'     => 'Mexican peso',
				'plural'       => 'Mexican pesos',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'TWD' => array(
				'name'         => 'New Taiwan dollar',
				'singular'     => 'New Taiwan dollar',
				'plural'       => 'New Taiwan dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 0,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'NZD' => array(
				'name'         => 'New Zealand dollar',
				'singular'     => 'New Zealand dollar',
				'plural'       => 'New Zealand dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'NOK' => array(
				'name'         => 'Norwegian krone',
				'singular'     => 'Norwegian krone',
				'plural'       => 'Norwegian kroner',
				'symbol'       => 'kr',
				'symbol_pos'   => 'left_space',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'PHP' => array(
				'name'         => 'Philippine peso',
				'singular'     => 'Philippine piso',
				'plural'       => 'Philippine pisos',
				'symbol'       => '₱',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'PLN' => array(
				'name'         => 'Polish złoty',
				'singular'     => 'Polish zloty',
				'plural'       => 'Polish zlotys',
				'symbol'       => 'zł',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'RUB' => array(
				'name'         => 'Russian ruble',
				'singular'     => 'Russian ruble',
				'plural'       => 'Russian rubles',
				'symbol'       => '₽',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'SGD' => array(
				'name'         => 'Singapore dollar',
				'singular'     => 'Singapore dollar',
				'plural'       => 'Singapore dollars',
				'symbol'       => '$',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'ZAR' => array(
				'name'         => 'South African rand',
				'singular'     => 'South African rand',
				'plural'       => 'South African rand',
				'symbol'       => 'R',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'SEK' => array(
				'name'         => 'Swedish krona',
				'singular'     => 'Swedish krona',
				'plural'       => 'Swedish kronor',
				'symbol'       => 'kr',
				'symbol_pos'   => 'right_space',
				'num_decimals' => 0,
				'decimal_sep'  => ',',
				'thousand_sep' => ' ',
			),
			'CHF' => array(
				'name'         => 'Swiss franc',
				'singular'     => 'Swiss franc',
				'plural'       => 'Swiss francs',
				'symbol'       => null,
				'symbol_pos'   => 'left_space',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => '\'',
			),
			'THB' => array(
				'name'         => 'Thai baht',
				'singular'     => 'Thai baht',
				'plural'       => 'Thai baht',
				'symbol'       => '฿',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
			),
			'TRY' => array(
				'name'         => 'Turkish lira',
				'singular'     => 'Turkish lira',
				'plural'       => 'Turkish Lira',
				'symbol'       => '₺',
				'symbol_pos'   => 'left',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
			'AED' => array(
				'name'         => 'United Arab Emirates dirham',
				'singular'     => 'UAE dirham',
				'plural'       => 'UAE dirhams',
				'symbol'       => null,
				'symbol_pos'   => 'right_space',
				'num_decimals' => 2,
				'decimal_sep'  => ',',
				'thousand_sep' => '.',
			),
		);
	}

}
