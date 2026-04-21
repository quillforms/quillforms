import { useState, useEffect, useRef } from '@wordpress/element';

const CustomTabs = ({
	tabs = [],
	onSelect,
	initialTabName,
	children,
	className = '',
}) => {
	const [selectedTab, setSelectedTab] = useState(
		initialTabName || tabs[0]?.name || ''
	);
	const buttonRefs = useRef({});

	// Sync with external state changes
	useEffect(() => {
		if (initialTabName) {
			setSelectedTab(initialTabName);
		}
	}, [initialTabName]);

	const handleTabClick = (tabName) => {
		setSelectedTab(tabName);
		onSelect?.(tabName);
	};

	const selectedTabData = tabs.find((tab) => tab.name === selectedTab);
	const activeButtonRef = buttonRefs.current[selectedTab];

	return (
		<div className={className} style={{ width: '100%', overflow: 'hidden' }}>
			{/* Tab Navigation */}
			<div className="qf-tabs-strip bg-[#F7F8FA] border !border-border-color rounded-[12px] px-3 py-2.5 flex gap-2 relative" style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', width: '100%', minWidth: 0 }}>
				{tabs.map((tab) => {
					const isActive = tab.name === selectedTab;
					return (
						<button
							key={tab.name}
							ref={(el) => (buttonRefs.current[tab.name] = el)}
							onClick={() => handleTabClick(tab.name)}
							className={`
								relative px-3 py-1.5 !rounded-[8px] text-[13px] font-medium leading-snug transition-all whitespace-nowrap flex-shrink-0
								${isActive
									? 'bg-[#FFEEFB] text-[#B2328C]'
									: 'bg-white text-[#334155] hover:bg-gray-50'
								}
								${tab.className || ''}
							`}
							aria-selected={isActive}
							role="tab"
						>
							{tab.title}
						</button>
					);
				})}
				{/* Active tab bottom border - positioned under the active tab button */}
				{activeButtonRef && (
					<div
						className="absolute bottom-0 h-[2px] bg-[#B2328C] transition-all duration-300"
						style={{
							left: `${activeButtonRef.offsetLeft}px`,
							width: `${activeButtonRef.offsetWidth}px`,
						}}
					></div>
				)}
			</div>

			{/* Tab Content */}
			{selectedTabData && children && (
				<div className="mt-3" role="tabpanel">
					{children(selectedTabData)}
				</div>
			)}
		</div>
	);
};

export default CustomTabs;

