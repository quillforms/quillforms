/**
 * QuillForms Dependencies
 */
import useGeneralTheme from '../../../hooks/use-general-theme';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { TailSpin as Loader } from 'react-loader-spinner';
import { css } from 'emotion';

interface Props {
	data: any;
}

const Coupon: React.FC< Props > = ( { data } ) => {
	const generalTheme = useGeneralTheme();
	const [ isPaying, setIsPaying ] = useState( false );
	const [ showCoupon, setShowCoupon ] = useState( false );
	const [ coupon, setCoupon ] = useState( '' );
	const { setPaymentData } = useDispatch( 'quillForms/renderer-core' );

	const applyCoupon = async () => {
		setIsPaying( true );
		try {
			const { submission_id, hashed_submission_id } = data;
			let response = await fetch(
				configApi.getAdminUrl() + 'admin-ajax.php',
				{
					method: 'POST',
					body: new URLSearchParams( {
						action: 'quillforms_apply_discount',
						formId: configApi.getFormId().toString(),
						submissionId: submission_id,
						hashedSubmissionId: hashed_submission_id,
						coupon,
					} ),
				}
			);

			let result = await response.json();
			if ( result.success ) {
				console.log( 'createSubscription: result', result, data );

				// Update new products
				const UpdatedData = { ...data };
				UpdatedData.payments.discount_amount = result.data.amount;
				setPaymentData( UpdatedData );
			} else {
				console.log( 'createSubscription: result', result, data );
			}
		} catch ( e ) {
			console.log( 'createSubscription: error throwed', e );
			return {
				success: false,
				message:
					e instanceof Error && e.message
						? e.message
						: 'Unexpected error',
			};
		}

		setIsPaying( false );
	};
	return (
		<div className="renderer-core-payment-coupon">
			<div
				className="renderer-core-payment-coupon__label"
				onClick={ () => setShowCoupon( true ) }
			>
				{ __( 'You have a coupon?', 'quillforms' ) }
			</div>
			{ showCoupon && (
				<div className="render-core-payment-coupon-form">
					<div className="renderer-core-payment-coupon__input">
						<input
							type="text"
							placeholder={ __(
								'Enter your coupon code',
								'quillforms'
							) }
							style={ {
								color: generalTheme.questionsColor,
								border: `1px solid rgba(0, 0, 0, 0.3)`,
								borderRadius: '8px',
								fontSize: '16px',
								padding: '10px 20px',
								lineHeight: '1',
							} }
							className={ classnames(
								css`
									&:focus {
										outline: none;
										border: 1px solid rgba( 0, 0, 0, 0.3 );
									}
								`
							) }
							value={ coupon }
							onChange={ ( e ) => setCoupon( e.target.value ) }
						/>
					</div>
					<div className="renderer-core-payment-coupon__apply">
						<button
							className={ classnames(
								{
									loading: isPaying,
								},
								css`
									border-radius: 8px;
									background: ${ generalTheme.buttonsBgColor };
									color: ${ generalTheme.buttonsFontColor };
									border: none;
									padding: 10px 20px;
									font-size: 16px;
									cursor: pointer;
									&.loading .renderer-core-arrow-icon {
										display: none;
									}
								`,
								'apply-coupon-button'
							) }
							onClick={ () => applyCoupon() }
						>
							<span id="button-text">
								{ isPaying ? (
									<Loader
										color={ generalTheme.buttonsFontColor }
										height={ 16 }
										width={ 16 }
									/>
								) : (
									__( 'Apply', 'quillforms' )
								) }
							</span>
						</button>
					</div>
				</div>
			) }
		</div>
	);
};

export default Coupon;
