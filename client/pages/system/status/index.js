/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import Loader from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import './style.scss';

const Status = () => {
	const [ report, setReport ] = useState( null );
	const [ reportTime, setReportTime ] = useState( null );
	const [ copyText, setCopyText ] = useState( null );
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	useEffect( () => {
		apiFetch( {
			path: `/qf/v1/system-status`,
			method: 'GET',
		} )
			.then( ( res ) => {
				setReport( res );
				setReportTime( new Date().toUTCString() );
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err?.message ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} );
	}, [] );

	const copyReport = () => {
		if ( ! report ) return;
		let reportText = '';
		for ( const env of report ) {
			reportText += `### ${ env.label_raw } ###\r\n\r\n`;
			for ( const table of env.items ) {
				reportText += `--- ${ table.label_raw }\r\n`;
				for ( const row of table.items ) {
					reportText += `${ row.label_raw ?? row.label }: ${
						row.value_raw ?? row.value
					}\r\n`;
				}
				reportText += `\r\n`;
			}
		}
		reportText += `### Fetched at: ${ reportTime } ###\r\n`;
		setCopyText( reportText );
	};

	const styleValue = ( value ) => {
		return value
			.replace( /✔/g, '<span class="system-status-check">✔</span>' )
			.replace( /✘/g, '<span class="system-status-times">✘</span>' );
	};

	const tables = report ? (
		<div>
			{ report.map( ( section, index ) => {
				return (
					<div key={ index }>
						<h1>{ section.label }</h1>
						{ section.items.map( ( table, index ) => {
							if ( table.items.length === 0 ) {
								return null;
							}
							return (
								<table key={ index }>
									<thead>
										<tr>
											<th colSpan={ 2 }>
												{ table.label }
											</th>
										</tr>
									</thead>
									<tbody>
										{ table.items.map( ( row, index ) => {
											return (
												<tr key={ index }>
													<td
														dangerouslySetInnerHTML={ {
															__html: row.label,
														} }
													></td>
													<td
														dangerouslySetInnerHTML={ {
															__html: styleValue(
																row.value
															),
														} }
													></td>
												</tr>
											);
										} ) }
									</tbody>
								</table>
							);
						} ) }
					</div>
				);
			} ) }
		</div>
	) : (
		''
	);

	return (
		<div className="quillforms-system-status-tab">
			<div className="quillforms-system-status-tab__body">
				{ report === null ? (
					<div
						className={ css`
							display: flex;
							flex-wrap: wrap;
							width: 100%;
							height: 100px;
							justify-content: center;
							align-items: center;
						` }
					>
						<Loader
							type="ThreeDots"
							color="#8640e3"
							height={ 50 }
							width={ 50 }
						/>
					</div>
				) : ! report ? (
					<div className="error">Error on loading system report</div>
				) : (
					<div>
						<div
							className={ css`
								display: flex;
								margin-bottom: 5px;
								button {
									margin-left: auto;
								}
							` }
						>
							<Button isPrimary onClick={ copyReport }>
								Copy System Status Report
							</Button>
						</div>
						{ tables }
					</div>
				) }
			</div>
			{ copyText && (
				<Modal
					title="System Status Report"
					focusOnMount={ true }
					onRequestClose={ () => setCopyText( null ) }
					className={ css`
						border: none !important;
						border-radius: 9px;
						width: 600px;

						textarea {
							width: 100%;
							height: calc( 100vh - 210px );
							background: #e6e6e6;
							padding: 5px 7px;
							white-space: pre-wrap;
						}
					` }
				>
					<textarea
						readOnly={ true }
						value={ copyText }
						onClick={ ( e ) => {
							e.target.select();
						} }
					/>
					<Button
						isPrimary
						onClick={ () => {
							navigator.clipboard.writeText( copyText );
							createSuccessNotice( '✅ Report Copied!', {
								type: 'snackbar',
								isDismissible: true,
							} );
						} }
					>
						Copy
					</Button>
				</Modal>
			) }
		</div>
	);
};

export default Status;
