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
		isFlat,
		isDanger,
		isTertiary,
		className,
		disabled,
		...additionalProps
	} = props;

	const classes = classnames( 'admin-components-button', className, {
		'is-button': isDefault || isPrimary || isLarge || isSmall || isDanger,
		'is-default': isDefault || isLarge || isSmall,
		'is-primary': isPrimary,
		'is-large': isLarge,
		'is-small': isSmall,
		'is-tertiary': isTertiary,
		'is-flat': isFlat,
		'is-danger': isDanger,
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
