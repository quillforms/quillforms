import { useState, useRef } from '@wordpress/element';
import { Icon, search, closeSmall } from '@wordpress/icons';
import { Button } from '@wordpress/components';

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

	return (
		<div
			style={{
				borderRadius: '16px',
				backgroundColor: '#FFFFFF',
				border: '1px solid #D9D9D9',
			}}
			className={`flex w-full min-w-[300px] md:max-w-[527px] !py-2 !px-4 justify-between items-center gap-1 transition-all ${className}`}
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
					border-radius: 16px !important;
					outline: none !important;
					box-shadow: none !important;
					background-color: transparent !important;
				}
			`}</style>
			<div className="flex items-center pointer-events-none">
				<Icon icon={search} className="text-gray-400 w-5 h-5" />
			</div>
			<input
				ref={inputRef}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder={placeholder}
				className="custom-search-input !py-0 !px-0 flex-1 text-base text-gray-600 placeholder-gray-400 min-w-0"
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
