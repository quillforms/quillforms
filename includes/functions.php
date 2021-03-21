<?php

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 * This function is forked from Woocommerce.
 *
 * @since 1.0.0
 *
 * @param string|array $var Data to sanitize.
 *
 * @return string|array
 */
function qf_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'qf_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}


/**
 * Get a shared logger instance.
 * This function is forked from Woocommerce
 *
 * Use the quillforms_logging_class filter to change the logging class. You may provide one of the following:
 *     - a class name which will be instantiated as `new $class` with no arguments
 *     - an instance which will be used directly as the logger
 * In either case, the class or instance *must* implement QF_Logger_Interface.
 *
 * @since 1.0.0
 * @see QF_Logger_Interface
 *
 * @return QF_Logger
 */
function qf_get_logger() {
	static $logger = null;

	$class = apply_filters( 'quillforms_logging_class', 'QF_Logger' );

	if ( null !== $logger && is_string( $class ) && is_a( $logger, $class ) ) {
		return $logger;
	}

	$implements = class_implements( $class );

	if ( is_array( $implements ) && in_array( 'QF_Logger_Interface', $implements, true ) ) {
		$logger = is_object( $class ) ? $class : new $class();
	} else {
		_doing_it_wrong(
			__FUNCTION__,
			sprintf(
				/* translators: 1: class name 2: quillforms_logging_class 3: QF_Logger_Interface */
				__( 'The class %1$s provided by %2$s filter must implement %3$s.', 'quillforms' ),
				'<code>' . esc_html( is_object( $class ) ? get_class( $class ) : $class ) . '</code>',
				'<code>quillforms_logging_class</code>',
				'<code>QF_Logger_Interface</code>'
			),
			'1.0.0'
		);

		$logger = is_a( $logger, 'QF_Logger' ) ? $logger : new QF_Logger();
	}

	return $logger;
}

/**
 * Trigger logging cleanup using the logging class.
 *
 * @since 1.0.0
 */
function qf_cleanup_logs() {
	$logger = qf_get_logger();

	if ( is_callable( array( $logger, 'clear_expired_logs' ) ) ) {
		$logger->clear_expired_logs();
	}
}
add_action( 'quillforms_cleanup_logs', 'qf_cleanup_logs' );
