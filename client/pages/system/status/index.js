/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

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
	const { createErrorNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		const formdata = new FormData();
		formdata.append( 'action', 'quillforms_get_system_status_report' );

		fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: formdata,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res.success ) {
					setReport( res.data );
				} else {
					createErrorNotice( `⛔ ${ res.data ?? 'Error' }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
					setReport( false );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
				setReport( false );
			} );
	}, [] );

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
															__html: row.value,
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
					<div>{ tables }</div>
				) }
			</div>
		</div>
	);
};

export default Status;
