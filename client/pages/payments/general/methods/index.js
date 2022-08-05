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
	ProLabel,
} from '@quillforms/admin-components';
import { NavLink } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { Button, Icon as IconComponent } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import { omit } from 'lodash';

const Methods = () => {
	const { general, models, updateGeneral } = usePaymentsContext();

	// is any model recurring.
	const recurring = !! Object.values( models ).find(
		( model ) => model.recurring
	);

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
		if ( recurring ) {
			let $methods = { ...general.methods };
			for ( const key in general.methods ) {
				const [ gateway, method ] = key.split( ':' );
				const data = gateways[ gateway ]?.methods[ method ];
				if ( ! data?.isRecurringSupported ) {
					$methods = omit( $methods, key );
				}
			}
			updateGeneral( { methods: $methods } );
		}
	}, [ models ] );

	// disable inactive and not configured methods.
	useEffect( () => {
		let $methods = { ...general.methods };
		for ( const key in general.methods ) {
			const [ gateway, method ] = key.split( ':' );
			const active = gateways[ gateway ]?.active;
			if (
				! active ||
				! gateways[ gateway ]?.methods[ method ]?.configured
			) {
				$methods = omit( $methods, key );
			}
		}
		updateGeneral( { methods: $methods } );
	}, [] );

	// reorder enabled methods.
	const reorder = ( index, action ) => {
		const toIndex = index + ( action === 'up' ? -1 : 1 );
		const $methods = Object.entries( general.methods );
		const item = $methods[ index ];
		$methods[ index ] = $methods[ toIndex ];
		$methods[ toIndex ] = item;
		updateGeneral( { methods: Object.fromEntries( $methods ) } );
	};

	// loop over the enabled methods then other methods.
	return (
		<div className="quillforms-payments-page-settings__methods">
			<h3>Methods</h3>
			<div className="quillforms-payments-page-settings__methods-content">
				{ Object.keys( general.methods ).map( ( key, index ) => {
					const [ gateway, method ] = key.split( ':' );
					const data = gateways[ gateway ].methods[ method ];
					return (
						<BaseControl key={ key }>
							<ControlWrapper orientation="horizontal">
								<div className="method-label">
									{ typeof data.admin.label.icon ===
									'string' ? (
										<img src={ data.admin.label.icon } />
									) : (
										<IconComponent
											icon={
												data.admin.label.icon?.src
													? data.admin.label.icon.src
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
										Object.keys( general.methods ).length -
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
											{ ...general.methods },
											key
										);
										updateGeneral( { methods } );
									} }
								/>
							</ControlWrapper>
						</BaseControl>
					);
				} ) }
				{ methods.map( ( key ) => {
					if ( Object.keys( general.methods ).includes( key ) ) {
						return null;
					}

					const [ gateway, method ] = key.split( ':' );
					const active = gateways[ gateway ].active;
					const data = gateways[ gateway ].methods[ method ];
					const configured = data?.configured ?? false;

					let notice = null;
					let available = true;

					// if method doesn't support recurring.
					if ( recurring && ! data?.isRecurringSupported ) {
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
											className="upgrade-plan"
											href="https://quillforms.com"
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
									to={ `/admin.php?page=quillforms&path=settings&tab=payments` }
								>
									Configure it
								</NavLink>
							</i>
						);
					}

					return (
						<div key={ key } className="payment-method">
							<ControlWrapper orientation="horizontal">
								<div className="method-label-wrapper">
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
										<div className="method-label-text">
											{ data.admin.label.text }
										</div>
									</div>
									<span className="method-label-notice">
										{ notice }
									</span>
								</div>
								<ToggleControl
									checked={ false }
									disabled={ ! available }
									onClick={ () => {
										updateGeneral(
											{
												methods: { [ key ]: {} },
											},
											'recursive'
										);
									} }
								/>
							</ControlWrapper>
						</div>
					);
				} ) }
			</div>
		</div>
	);
};

export default Methods;
