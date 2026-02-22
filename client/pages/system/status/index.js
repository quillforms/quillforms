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

	// Get first section and first table only
	const firstSection = report && report.length > 0 ? report[0] : null;
	const firstTable = firstSection && firstSection.items.length > 0 ? firstSection.items[0] : null;

	const firstTableDisplay = firstTable && firstTable.items.length > 0 ? (
		<div className="w-full bg-[#F7F8FA] min-h-[calc(100vh-200px)] rounded-[20px] border border-border-color px-5 py-6">
			{/* Section header with button */}
			<div className="flex items-center justify-between mb-4 w-full">
				<h2 className="text-xl font-semibold text-[#001D4F] m-0">
					{firstSection.label}
				</h2>
				<CustomButton
					text={__('Copy System Status Report', 'quillforms')}
					onClick={copyReport}
					variant="primary"
					className="!px-4 !py-2"
				/>
			</div>

			{/* First table only */}
			<div className="mb-6 w-full overflow-hidden rounded-[20px] border border-[#ddd] bg-white">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th
								colSpan={2}
								className="bg-[#fff] border-b border-[#ddd] px-4 py-3 text-left font-semibold text-[#334155]"
							>
								{firstTable.label}
							</th>
						</tr>
					</thead>
					<tbody>
						{firstTable.items.map((row, rowIndex) => {
							const isLast = rowIndex === firstTable.items.length - 1;
							return (
								<tr
									key={rowIndex}
									className={
										rowIndex % 2 === 0
											? 'bg-[#F2F4FC]'
											: 'bg-white'
									}
								>
									<td
										className={`w-[250px] px-4 py-3 text-[#334155] font-medium border-r border-[#ddd] ${!isLast ? 'border-b border-[#ddd]' : ''
											}`}
										dangerouslySetInnerHTML={{
											__html: row.label,
										}}
									/>
									<td
										className={`px-4 py-3 text-[#334155] ${!isLast ? 'border-b border-[#ddd]' : ''
											}`}
										dangerouslySetInnerHTML={{
											__html: styleValue(row.value),
										}}
									/>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
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
					<div className="w-full">{firstTableDisplay}</div>
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
