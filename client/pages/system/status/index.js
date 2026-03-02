/**
 * QuillForms Dependencies.
 */
import CustomButton from '../../../components/custom-button';
import CustomModal from '../../../components/custom-modal';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { ThreeDots as Loader } from 'react-loader-spinner';

const Status = () => {
	const [report, setReport] = useState(null);
	const [reportTime, setReportTime] = useState(null);
	const [copyText, setCopyText] = useState(null);
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	useEffect(() => {
		apiFetch({ path: `/qf/v1/system-status`, method: 'GET' })
			.then((res) => {
				setReport(res);
				setReportTime(new Date().toUTCString());
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err?.message ?? 'Error'}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			});
	}, []);

	const copyReport = () => {
		if (!report) return;
		let reportText = '';
		for (const env of report) {
			reportText += `### ${env.label_raw} ###\r\n\r\n`;
			for (const table of env.items) {
				reportText += `--- ${table.label_raw}\r\n`;
				for (const row of table.items) {
					reportText += `${row.label_raw ?? row.label}: ${row.value_raw ?? row.value
						}\r\n`;
				}
				reportText += `\r\n`;
			}
		}
		reportText += `### Fetched at: ${reportTime} ###\r\n`;
		setCopyText(reportText);
	};

	const styleValue = (value) => {
		return value
			.replace(/✔/g, '<span class="text-green-600 font-semibold">✔</span>')
			.replace(/✘/g, '<span class="text-red-600 font-semibold">✘</span>');
	};

	const allTablesDisplay = report && report.length > 0 ? (
		<div className="w-full bg-[#F7F8FA] min-h-[calc(100vh-200px)] rounded-[20px] border border-border-color px-5 py-6">
			{/* Top header with copy button */}
			<div className="flex items-center justify-between mb-6 w-full">
				<h2 className="text-xl font-semibold text-[#001D4F] m-0">
					{__('System Status', 'quillforms')}
				</h2>
				<CustomButton
					text={__('Copy System Status Report', 'quillforms')}
					onClick={copyReport}
					variant="primary"
					className="!px-4 !py-2"
				/>
			</div>

			{/* All sections and all tables */}
			{report.map((section, sectionIndex) => (
				<div key={sectionIndex} className="mb-8">
					<h3 className="text-base font-semibold text-[#001D4F] mb-3">
						{section.label}
					</h3>
					{section.items.map((table, tableIndex) => {
						if (table.items.length === 0) return null;
						return (
							<div
								key={tableIndex}
								className="mb-4 w-full overflow-hidden rounded-[12px] border border-[#ddd] bg-white"
							>
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th
												colSpan={2}
												className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]"
											>
												{table.label}
											</th>
										</tr>
									</thead>
									<tbody>
										{table.items.map((row, rowIndex) => {
											const isLast = rowIndex === table.items.length - 1;
											const labelHasLink = /<a\s/i.test(row.label);
											const valueHasLink = /<a\s/i.test(row.value);
											return (
												<tr
													key={rowIndex}
													className={rowIndex % 2 === 0 ? 'bg-[#F2F4FC]' : 'bg-white'}
												>
													<td
														className={`w-[250px] px-4 py-3 font-medium border-r border-[#ddd] ${!isLast ? 'border-b border-[#ddd]' : ''}`}
														style={{ color: labelHasLink ? '#236294' : '#334155', textDecoration: labelHasLink ? 'underline' : 'none' }}
														dangerouslySetInnerHTML={{ __html: row.label }}
													/>
													<td
														className={`px-4 py-3 ${!isLast ? 'border-b border-[#ddd]' : ''}`}
														style={{ color: valueHasLink ? '#236294' : '#334155', textDecoration: valueHasLink ? 'underline' : 'none' }}
														dangerouslySetInnerHTML={{ __html: styleValue(row.value) }}
													/>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						);
					})}
				</div>
			))}
		</div>
	) : null;

	return (
		<div className="quillforms-system-status-tab w-full">
			<div className="quillforms-system-status-tab__body w-full">
				{report === null ? (
					<div className="flex justify-center items-center h-24">
						<Loader color="#8640e3" height={50} width={50} />
					</div>
				) : !report ? (
					<div className="text-red-500 p-4">
						{__('Error on loading system report', 'quillforms')}
					</div>
				) : (
					<div className="w-full">{allTablesDisplay}</div>
				)}
			</div>
			{copyText && (
				<CustomModal
					isOpen={!!copyText}
					onClose={() => setCopyText(null)}
					title={__('System Status Report', 'quillforms')}
					className="!max-w-[600px]"
				>
					<textarea
						readOnly={true}
						value={copyText}
						onClick={(e) => {
							e.target.select();
						}}
						className="w-full h-[calc(100vh-300px)] bg-[#e6e6e6] p-3 whitespace-pre-wrap border-none outline-none resize-none font-mono text-sm rounded-lg"
					/>
					<div className="mt-4 flex justify-end">
						<CustomButton
							text={__('Copy', 'quillforms')}
							onClick={() => {
								navigator.clipboard.writeText(copyText);
								createSuccessNotice('✅ Report Copied!', {
									type: 'snackbar',
									isDismissible: true,
								});
								setCopyText(null);
							}}
							variant="primary"
						/>
					</div>
				</CustomModal>
			)}
		</div>
	);
};

export default Status;
