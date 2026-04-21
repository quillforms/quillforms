const CustomButton = ({
	text,
	icon,
	onClick,
	variant = 'primary',
	className = '',
	...props
}) => {
	const variantClasses = {
		primary:
			'bg-quillforms-primary !text-white hover:bg-quillforms-primary-dark hover:!text-white focus:!text-white active:!text-white !border-0 !border-none',
		secondary:
			'bg-gray-500 !text-white hover:bg-gray-600 hover:!text-white focus:!text-white active:!text-white',
		danger:
			'bg-[#E13B3B] !text-white hover:bg-[#E13B3B] hover:!text-white focus:!text-white active:!text-white',
		outline:
			'bg-white border !border-border-color hover:!border-border-color focus:!border-border-color active:!border-border-color focus:!outline-none !text-[#334155]',
		outlineSecondary:
			'bg-white border !border-[#B2328C] hover:!border-[#B2328C] focus:!border-[#B2328C] active:!border-[#B2328C] focus:!outline-none !text-[#B2328C]',
	};

	/* Admin default: 38px control height, rounded-xl — keep in sync with CustomSearch & view toggles */
	const sharedLayout = `inline-flex items-center gap-2 box-border text-sm font-medium leading-5 min-h-[38px] py-2 px-4 rounded-xl ${className}`;

	const baseClasses = `${sharedLayout} ${icon ? 'justify-between' : 'justify-center'} ${variantClasses[variant]}`;

	return (
		<button className={baseClasses} onClick={onClick} {...props}>
			{text}
			{icon && (
				<span className=" flex items-center justify-center">
					{icon}
				</span>
			)}
		</button>
	);
};

export default CustomButton;
