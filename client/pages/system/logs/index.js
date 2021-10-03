/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';

const Logs = () => {
	const [ page, setPage ] = useState( 1 );
	const [ perPage, setPerPage ] = useState( 10 );
	const [ totalPages, setTotalPages ] = useState( null );

	const [ logs, setLogs ] = useState( null ); // null for loading, false for error empty array for empty list
	const [ modalLogId, setModalLogId ] = useState( null ); // null for no log to show

	useEffect( () => {
		apiFetch( {
			path: `/qf/v1/logs?page=${ page }&per_page=${ perPage }`,
			method: 'GET',
		} ).then( ( res ) => {
			setLogs( res.items );
			setTotalPages( res.total_pages );
		} );
	}, [ page, perPage ] );

	const logsExport = () => {
		apiFetch( {
			path: `/qf/v1/logs?export=json`,
			method: 'GET',
			parse: false,
		} )
			.then( ( res ) => res.blob() )
			.then( ( blob ) => {
				const url = window.URL.createObjectURL( blob );
				const a = document.createElement( 'a' );
				a.style.display = 'none';
				a.href = url;
				a.download = 'Logs_Export.json';
				document.body.appendChild( a );
				a.click();
				window.URL.revokeObjectURL( url );
			} );
	};

	const modalLog = modalLogId
		? logs.find( ( log ) => log.log_id === modalLogId )
		: null;

	return (
		<div className="quillforms-logs-tab">
			<div className="quillforms-logs-tab__body">
				<div
					className={ css`
						display: flex;
						margin-bottom: 5px;
						button {
							margin-left: auto;
						}
					` }
				>
					<Button isPrimary onClick={ logsExport }>
						Export
					</Button>
				</div>
				<div className="quillforms-logs-tab__body-logs">
					{ logs === null ? (
						'Loading'
					) : (
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Source</th>
									<th>Level</th>
									<th>Message</th>
									<th>Time</th>
								</tr>
							</thead>
							<tbody>
								{ logs.map( ( log ) => (
									<tr
										key={ log.log_id }
										onClick={ () =>
											setModalLogId( log.log_id )
										}
									>
										<td>{ log.log_id }</td>
										<td>{ log.plugin }</td>
										<td>{ log.level }</td>
										<td>{ log.message }</td>
										<td>{ log.local_datetime }</td>
									</tr>
								) ) }
							</tbody>
						</table>
					) }
					<div
						className={ css`
							margin-top: 10px;
							text-align: center;
						` }
					>
						{ totalPages &&
							Array( totalPages )
								.fill( null )
								.map( ( _v, index ) => {
									return (
										<Button
											key={ index }
											isPrimary
											className={ css`
												margin: 2px;
												${ index + 1 === page
													? 'color: #000 !important;'
													: '' }
											` }
											onClick={ () =>
												setPage( index + 1 )
											}
										>
											{ index + 1 }
										</Button>
									);
								} ) }
					</div>
				</div>
			</div>
			{ modalLog && (
				<Modal
					title="Log details"
					focusOnMount={ true }
					onRequestClose={ () => setModalLogId( null ) }
					className={ css`
						border: none !important;
						border-radius: 9px;
						width: 600px;

						.components-modal__header {
							background: #ffc107;
						}
						pre {
							background: #e6e6e6;
							padding: 5px 7px;
							white-space: pre-wrap;
						}
					` }
				>
					<div>{ modalLog.source }</div>
					<pre>{ JSON.stringify( modalLog.context, null, 2 ) }</pre>
				</Modal>
			) }
		</div>
	);
};

export default Logs;