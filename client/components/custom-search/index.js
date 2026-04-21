import { useState, useRef } from '@wordpress/element';
import { Icon, search, closeSmall } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import SearchIcon from '../icon/search-icon';

const CustomSearch = ({
	value = '',
	onChange,
	placeholder = 'Search here',
	className = '',
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef(null);

	const handleReset = () => {
		onChange('');
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const wrapperStyle = {
		borderRadius: '12px',
		backgroundColor: '#FFFFFF',
		border: isFocused ? '1px solid #B2328C' : '1px solid #D9D9D9',
		boxShadow: isFocused
			? '0 0 0 1px rgba(178, 50, 140, 0.25)'
			: 'none',
		minHeight: '38px',
		height: '38px',
		maxHeight: '38px',
		boxSizing: 'border-box',
	};

	return (
		<div
			style={wrapperStyle}
			className={`qf-admin-search flex w-full min-w-[220px] max-w-full !py-0 !px-3 justify-between items-center gap-2 transition-all ${className}`}
		>
			<style>{`
				input[type="search"]::-webkit-search-cancel-button {
					display: none;
				}
				input[type="search"]::-webkit-search-decoration {
					display: none;
				}
				.custom-search-input {
					border: none !important;
					border-radius: 12px !important;
					outline: none !important;
					box-shadow: none !important;
					background-color: transparent !important;
				}
			`}</style>
			<div className="flex shrink-0 items-center pointer-events-none">
				<SearchIcon width={18} height={18} />
			</div>
			<input
				ref={inputRef}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder={placeholder}
				className="custom-search-input !py-0 !px-0 flex-1 text-[13px] leading-snug text-gray-600 placeholder-gray-400 min-w-0"
				autoComplete="off"
				{...props}
			/>
			{value && (
				<div className=" flex items-center">
					<Button
						size="small"
						icon={closeSmall}
						onClick={handleReset}
						className="!p-1 hover:!bg-gray-100 !rounded-full transition-colors"
						aria-label="Clear search"
					/>
				</div>
			)}
		</div>
	);
};

export default CustomSearch;
