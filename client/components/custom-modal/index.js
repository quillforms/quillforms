import { useEffect } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { close } from '@wordpress/icons';

const CustomModal = ({
	isOpen,
	onClose,
	title,
	children,
	className = '',
	noBorder = false,
	centerTitle = false
}) => {
	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[999999] flex items-center justify-center"
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			{/* Modal */}
			<div
				className={`relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] min-w-[500px] max-w-[600px] w-full mx-4 ${className}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className={`flex items-center ${centerTitle ? 'justify-center' : 'justify-between'} p-6 ${noBorder ? '' : 'border-b pb-4 border-[#E2E8F0]'}`}>
					<h2 className={`text-2xl font-medium text-[#334155] m-0 ${centerTitle ? 'flex-1 text-center' : ''}`}>
						{title}
					</h2>
					<button
						onClick={onClose}
						className={`p-2 text-[#6B7280] hover:text-[#334155] transition-colors ${centerTitle ? 'absolute right-6 top-6' : ''}`}
						aria-label="Close"
					>
						<Icon icon={close} size={24} />
					</button>
				</div>

				{/* Content */}
				<div className={`p-6 ${noBorder ? ' pt-0' : ' pt-6'}`}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default CustomModal;

