/**
 * External dependencies
 */
import { css } from 'emotion';

const CheckboxControl = ({ checkboxStatus, clicked }) => {
	return (
		<div
			className={css`
				position: relative;
				display: inline-block;
				outline: 0 !important;
				border: none !important;
				vertical-align: baseline;
				margin-right: 10px;
				font-style: normal;
				min-height: 17px;
				font-size: 1rem;
				line-height: 17px;
				min-width: 17px;
			` }
		>
			<input
				className={css`
					z-index: -1;
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0 !important;
					outline: 0;
					width: 17px;
					height: 17px;
					&:checked ~ label:before {
						background: #fff;
						border-color: rgba( 34, 36, 38, 0.35 );
					}

					&:checked ~ label svg {
						opacity: 1;
						color: rgba( 0, 0, 0, 0.95 );
					}
				` }
				readonly=""
				tabindex="0"
				type="checkbox"
				checked={
					checkboxStatus === 'checked' || checkboxStatus === 'mixed'
				}
			/>
			<label
				onClick={(e) => {
					e.stopPropagation();
					clicked();
				}}
				className={css`
					&:before {
						position: absolute;
						top: 0;
						left: 0;
						width: 17px;
						height: 17px;
						content: '';
						background: #fff;
						border-radius: 0.21428571rem;
						-webkit-transition: border 0.1s ease, opacity 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							transform 0.1s ease, box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							transform 0.1s ease, box-shadow 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
						border: 1px solid #d4d4d5;
					}
				` }
			>
				<svg
					className={css`
						position: absolute;
						top: 1px;
						left: 1px;
						width: 17px;
						height: 17px;
						text-align: center;
						opacity: 0;
						color: rgba( 0, 0, 0, 0.87 );
						-webkit-transition: border 0.1s ease, opacity 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							transform 0.1s ease, box-shadow 0.1s ease;
						transition: border 0.1s ease, opacity 0.1s ease,
							transform 0.1s ease, box-shadow 0.1s ease,
							-webkit-transform 0.1s ease,
							-webkit-box-shadow 0.1s ease;
					` }
					height="32"
					width="32"
					viewBox="0 0 24 24"
				>
					{checkboxStatus === 'mixed' ? (
						<path d="M7 11h12v2H6z"></path>
					) : (
						<>
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
						</>
					)}
				</svg>
			</label>
		</div>
	);
};

export default CheckboxControl;
