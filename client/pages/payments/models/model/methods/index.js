/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
} from '@quillforms/admin-components';
import { NavLink } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { Button } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';
import { omit } from 'lodash';

const Methods = ( { id } ) => {
	const { models, updateModel } = usePaymentsContext();
	const model = models[ id ];

	// all registered gateways and methods.
	const gateways = getPaymentGatewayModules();
	const methods = [];
	for ( const [ gateway, data ] of Object.entries( gateways ) ) {
		for ( const method of Object.keys( data.methods ) ) {
			methods.push( `${ gateway }:${ method }` );
		}
	}

	// disable recurring unsupported methods.
	useEffect( () => {
		if ( model.recurring ) {
			let $methods = { ...model.methods };
			for ( const key in model.methods ) {
				const [ gateway, method ] = key.split( ':' );
				const data = gateways[ gateway ]?.methods[ method ];
				if ( model.recurring && ! data?.isRecurringSupported ) {
					$methods = omit( $methods, key );
				}
			}
			updateModel( id, { methods: $methods } );
		}
	}, [ model.recurring ] );

	// disable inactive and not configured methods.
	useEffect( () => {
		let $methods = { ...model.methods };
		for ( const key in model.methods ) {
			const [ gateway, method ] = key.split( ':' );
			const active = gateways[ gateway ]?.active;
			if (
				! active ||
				! gateways[ gateway ]?.methods[ method ]?.configured
			) {
				$methods = omit( $methods, key );
			}
		}
		updateModel( id, { methods: $methods } );
	}, [] );

	// reorder enabled methods.
	const reorder = ( index, action ) => {
		const toIndex = index + ( action === 'up' ? -1 : 1 );
		const $methods = Object.entries( model.methods );
		const item = $methods[ index ];
		$methods[ index ] = $methods[ toIndex ];
		$methods[ toIndex ] = item;
		updateModel( id, { methods: Object.fromEntries( $methods ) } );
	};

	// loop over the enabled methods then other methods.
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Methods" />
				<div className="payment-model-methods">
					{ Object.keys( model.methods ).map( ( key, index ) => {
						const [ gateway, method ] = key.split( ':' );
						const data = gateways[ gateway ].methods[ method ];
						return (
							<BaseControl key={ key }>
								<ControlWrapper orientation="horizontal">
									<div className="method-label">
										{ typeof data.admin.label.icon ===
										'string' ? (
											<img
												src={ data.admin.label.icon }
											/>
										) : (
											<IconComponent
												icon={
													data.admin.label.icon?.src
														? data.admin.label.icon
																.src
														: data.admin.label.icon
												}
											/>
										) }
										{ data.admin.label.text }
										{ index !== 0 && (
											<Button
												onClick={ () =>
													reorder( index, 'up' )
												}
											>
												↑
											</Button>
										) }
										{ index !==
											Object.keys( model.methods )
												.length -
												1 && (
											<Button
												onClick={ () =>
													reorder( index, 'down' )
												}
											>
												↓
											</Button>
										) }
									</div>
									<ToggleControl
										checked={ true }
										onChange={ () => {
											const methods = omit(
												{ ...model.methods },
												key
											);
											updateModel( id, { methods } );
										} }
									/>
								</ControlWrapper>
								{ data.admin.options && (
									<data.admin.options
										slug={ key }
										model={ model }
										onChange={ ( options ) => {
											updateModel(
												id,
												{
													methods: {
														[ key ]: { options },
													},
												},
												'recursive'
											);
										} }
									/>
								) }
							</BaseControl>
						);
					} ) }
					{ methods.map( ( key ) => {
						if ( Object.keys( model.methods ).includes( key ) ) {
							return null;
						}

						const [ gateway, method ] = key.split( ':' );
						const active = gateways[ gateway ].active;
						const data = gateways[ gateway ].methods[ method ];
						const configured = data?.configured ?? false;

						let notice = null;
						let available = true;

						// if method doesn't support recurring.
						if ( model.recurring && ! data?.isRecurringSupported ) {
							available = false;
							notice = <i>Doesn't support recurring</i>;
						}

						// if gateway addon is not active.
						if ( available && ! active ) {
							available = false;

							const addon = ConfigApi.getStoreAddons()[ gateway ];
							if ( addon.is_installed ) {
								notice = (
									<i>
										<NavLink
											to={ `/admin.php?page=quillforms&path=addons` }
										>
											Activate it
										</NavLink>
									</i>
								);
							} else {
								const isPlanAccessible = ConfigApi.isPlanAccessible(
									addon.plan
								);
								if ( isPlanAccessible ) {
									notice = (
										<i>
											<NavLink
												to={ `/admin.php?page=quillforms&path=addons` }
											>
												Install it
											</NavLink>
										</i>
									);
								} else {
									notice = (
										<i>
											<a
												href="https://quillforms.com"
												target="_blank"
											>
												Upgrade your plan
											</a>
										</i>
									);
								}
							}
						}

						// if method is not configured.
						if ( available && ! configured ) {
							available = false;

							notice = (
								<i>
									<NavLink
										to={ `/admin.php?page=quillforms&path=settings` }
									>
										Configure it
									</NavLink>
								</i>
							);
						}

						return (
							<BaseControl key={ key }>
								<ControlWrapper orientation="horizontal">
									<div className="method-label">
										{ typeof data.admin.label.icon ===
										'string' ? (
											<img
												src={ data.admin.label.icon }
											/>
										) : (
											<IconComponent
												icon={
													data.admin.label.icon?.src
														? data.admin.label.icon
																.src
														: data.admin.label.icon
												}
											/>
										) }
										{ data.admin.label.text }
										<span className="method-label-notice">
											{ notice }
										</span>
									</div>
									<ToggleControl
										checked={ false }
										disabled={ ! available }
										onChange={ () => {
											updateModel(
												id,
												{
													methods: { [ key ]: {} },
												},
												'recursive'
											);
										} }
									/>
								</ControlWrapper>
							</BaseControl>
						);
					} ) }
				</div>
			</ControlWrapper>
		</BaseControl>
	);
};

export default Methods;
