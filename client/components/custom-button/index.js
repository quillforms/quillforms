import { Button } from '@wordpress/components';

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
			'bg-quillforms-primary !text-white hover:bg-quillforms-primary-dark hover:!text-white focus:!text-white active:!text-white',
		secondary:
			'bg-gray-500 !text-white hover:bg-gray-600 hover:!text-white focus:!text-white active:!text-white',
		danger:
			'bg-red-600 !text-white hover:bg-red-700 hover:!text-white focus:!text-white active:!text-white',
		outline:
			'bg-white p-3 border !border-border-color rounded-2xl hover:!border-border-color focus:!border-border-color active:!border-border-color focus:!outline-none !text-[#334155]',
	};

	const baseClasses =
		variant === 'outline'
			? `${variantClasses[variant]} ${className}`
			: `flex items-center justify-center gap-1 text-lg font-medium leading-7 py-3 px-6 rounded-2xl ${variantClasses[variant]} ${className}`;

	return (
		<button className={baseClasses} onClick={onClick} {...props}>
			{icon && (
				<span className="w-5 h-5 flex items-center justify-center">
					{icon}
				</span>
			)}
			{text}
		</button>
	);
};

export default CustomButton;
