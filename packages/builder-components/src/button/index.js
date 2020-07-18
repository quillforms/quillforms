/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { createElement, forwardRef } from '@wordpress/element';

export function Button( props, ref ) {
	const {
		isDefault,
		isPrimary,
		isLarge,
		isSmall,
		isTertiary,
		className,
		disabled,
		...additionalProps
	} = props;

	const classes = classnames( 'builder-components-button', className, {
		'is-button': isDefault || isPrimary || isLarge || isSmall,
		'is-default': isDefault || isLarge || isSmall,
		'is-primary': isPrimary,
		'is-large': isLarge,
		'is-small': isSmall,
		'is-tertiary': isTertiary,
	} );

	const tag = 'button';
	const tagProps = { type: 'button', disabled };

	return createElement( tag, {
		...tagProps,
		...additionalProps,
		className: classes,
		ref,
	} );
}

export default forwardRef( Button );
