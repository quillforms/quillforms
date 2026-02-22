/**
 * QuillForms Dependencies.
 */
import CustomButton from '../../../components/custom-button';
import CustomModal from '../../../components/custom-modal';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { download, trash } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { ThreeDots as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import noLogsImage from '../../../../assets/images/no-logs.png';

const Logs = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(null);

	const [logs, setLogs] = useState(null); // null for loading, false for error empty array for empty list
	const [modalLogId, setModalLogId] = useState(null); // null for no log to show

	useEffect(() => {
		apiFetch({
			path: `/qf/v1/logs?page=${page}&per_page=${perPage}`,
			method: 'GET',
		})
			.then((res) => {
				setLogs(res.items);
				setTotalPages(res.total_pages);
			})
			.catch(() => {
				setLogs(false);
			});
	}, [page, perPage]);

	const logsClear = () => {
		if (!window.confirm(__('Are you sure you want to clear all logs?', 'quillforms'))) {
			return;
		}
		apiFetch({
			path: `/qf/v1/logs`,
			method: 'DELETE',
		}).then(() => {
			setPage(1);
			setTotalPages(null);
			setLogs([]);
		});
	};

	const logsExport = () => {
		apiFetch({
			path: `/qf/v1/logs?export=json`,
			method: 'GET',
			parse: false,
		})
			.then((res) => res.blob())
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = 'Logs_Export.json';
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			});
	};

	const getLogLevel = (level) => {
		const levelColors = {
			emergency: 'text-purple-600',
			alert: 'text-purple-600',
			critical: 'text-purple-600',
			error: 'text-red-600',
			warning: 'text-orange-600',
			notice: 'text-blue-600',
			info: 'text-cyan-600',
			debug: 'text-black',
		};
		const levelLabels = {
			emergency: __('Emergency', 'quillforms'),
			alert: __('Alert', 'quillforms'),
			critical: __('Critical', 'quillforms'),
			error: __('Error', 'quillforms'),
			warning: __('Warning', 'quillforms'),
			notice: __('Notice', 'quillforms'),
			info: __('Info', 'quillforms'),
			debug: __('Debug', 'quillforms'),
		};
		return (
			<span className={levelColors[level] || 'text-gray-600'}>
				{levelLabels[level] || level}
			</span>
		);
	};

	const modalLog = modalLogId
		? logs?.find((log) => log.log_id === modalLogId)
		: null;

	return (
		<div className="quillforms-logs-tab w-full">
			<div className="quillforms-logs-tab__body w-full">
				{logs === null ? (
					<div className="flex justify-center items-center h-24">
						<Loader color="#8640e3" height={50} width={50} />
					</div>
				) : !logs ? (
					<div className="text-red-500 p-4">
						{__('Cannot fetch logs', 'quillforms')}
					</div>
				) : (
					<div className="w-full bg-[#F7F8FA] min-h-[calc(100vh-200px)] rounded-[20px] border border-border-color px-5 py-6">
						{/* Header with buttons - always visible */}
						<div className="flex items-center justify-between mb-4 w-full">
							<h2 className="text-xl font-semibold text-[#001D4F] m-0">
								{__('All Logs', 'quillforms')}
							</h2>
							<div className="flex items-center gap-0">
								<button
									onClick={logsExport}
									disabled={!logs || logs.length === 0}
									className="flex items-center gap-2 text-[#334155] hover:text-[#B2328C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0 cursor-pointer"
								>
									<span className="text-sm font-normal">{__('Export', 'quillforms')}</span>
									<Icon icon={download} size={16} />
								</button>
								<div className="w-px h-4 bg-gray-300 mx-3" />
								<button
									onClick={logsClear}
									disabled={!logs || logs.length === 0}
									className="flex items-center gap-2 text-[#334155] hover:text-[#B2328C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0 cursor-pointer"
								>
									<span className="text-sm font-normal">{__('Clear All', 'quillforms')}</span>
									<Icon icon={trash} size={16} />
								</button>
							</div>
						</div>

						{/* Content - ternary operator */}
						{logs.length === 0 ? (
							<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
								<img
									src={noLogsImage}
									alt="Empty logs"
									className="w-auto h-auto max-w-md mb-6"
								/>
								<h3 className="text-xl font-bold text-[#334155] mb-3">
									{__('Logs Are Currently Empty — No Events Detected in the System', 'quillforms')}
								</h3>
								<p className="text-base text-[#777] max-w-lg leading-relaxed">
									{__('The system has not recorded any events. Logs will populate automatically when form submissions or system actions occur.', 'quillforms')}
								</p>
							</div>
						) : (
							<>
								{/* Table */}
								<div className="w-full overflow-hidden rounded-[20px] border border-[#ddd] bg-white mb-4">
									<table className="w-full border-collapse">
										<thead>
											<tr>
												<th className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]">
													{__('ID', 'quillforms')}
												</th>
												<th className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]">
													{__('Source', 'quillforms')}
												</th>
												<th className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]">
													{__('Level', 'quillforms')}
												</th>
												<th className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]">
													{__('Message', 'quillforms')}
												</th>
												<th className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]">
													{__('Time', 'quillforms')}
												</th>
											</tr>
										</thead>
										<tbody>
											{logs.map((log, rowIndex) => {
												const isLast = rowIndex === logs.length - 1;
												return (
													<tr
														key={log.log_id}
														onClick={() => setModalLogId(log.log_id)}
														className={`cursor-pointer hover:bg-gray-50 transition-colors ${rowIndex % 2 === 0
															? 'bg-[#F2F4FC]'
															: 'bg-white'
															}`}
													>
														<td
															className={`px-4 py-3 text-[#334155] ${!isLast ? 'border-b border-[#ddd]' : ''
																}`}
														>
															{log.log_id}
														</td>
														<td
															className={`px-4 py-3 text-[#334155] ${!isLast ? 'border-b border-[#ddd]' : ''
																}`}
														>
															{log.plugin || '-'}
														</td>
														<td
															className={`px-4 py-3 ${!isLast ? 'border-b border-[#ddd]' : ''
																}`}
														>
															{getLogLevel(log.level)}
														</td>
														<td
															className={`px-4 py-3 text-[#334155] ${!isLast ? 'border-b border-[#ddd]' : ''
																}`}
														>
															{log.message || '-'}
														</td>
														<td
															className={`px-4 py-3 text-[#334155] ${!isLast ? 'border-b border-[#ddd]' : ''
																}`}
														>
															{log.local_datetime || '-'}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								{totalPages && totalPages > 1 && (
									<div className="flex justify-center gap-2 mt-4">
										{Array(totalPages)
											.fill(null)
											.map((_, index) => {
												const pageNum = index + 1;
												return (
													<CustomButton
														key={index}
														text={String(pageNum)}
														onClick={() => {
															setLogs(null);
															setPage(pageNum);
														}}
														variant={page === pageNum ? 'primary' : 'outlineSecondary'}
														className="!px-3 !py-1 !min-w-[40px]"
													/>
												);
											})}
									</div>
								)}
							</>
						)}
					</div>
				)}
			</div>

			{/* Log details modal */}
			{modalLog && (
				<CustomModal
					isOpen={!!modalLog}
					onClose={() => setModalLogId(null)}
					title={__('Log details', 'quillforms')}
					className="!max-w-[600px]"
				>
					<div className="space-y-4">
						<div>
							<strong>{__('Source:', 'quillforms')}</strong>
							<div className="mt-1">{modalLog.source || '-'}</div>
						</div>
						<div>
							<strong>{__('Context:', 'quillforms')}</strong>
							<pre className="mt-1 bg-[#e6e6e6] p-3 rounded-lg whitespace-pre-wrap text-sm overflow-auto max-h-[400px]">
								{JSON.stringify(modalLog.context, null, 2)}
							</pre>
						</div>
					</div>
				</CustomModal>
			)}
		</div>
	);
};

export default Logs;
