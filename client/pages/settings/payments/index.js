/**
 * QuillForms Dependencies.
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';
import ConfigApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { Icon as IconComponent } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import './style.scss';
import SearchIcon from '../../../components/icon/search-icon';
import CustomButton from '../../../components/custom-button';

const Payments = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [activeGateway, setActiveGateway] = useState(null);

	const gateways = getPaymentGatewayModules();

	const filteredGateways = Object.entries(gateways).filter(([slug, gateway]) => {
		if (!searchTerm) return true;
		const term = searchTerm.toLowerCase();
		return (
			(gateway.name || '').toLowerCase().includes(term) ||
			(gateway.description || '').toLowerCase().includes(term)
		);
	});

	return (
		<div className="quillforms-settings-payments-tab">
			{/* Search */}
			<div className="quillforms-settings-payments-tab__search">
				<SearchIcon color="#9ca3af" />
				<input
					type="search"
					placeholder={__('Search here', 'quillforms')}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Cards grid */}
			<div className="quillforms-settings-payments-tab__grid">
				{filteredGateways.map(([slug, gateway]) => {
					const icon = gateway.icon?.mini ?? gateway.icon;
					const addon = ConfigApi.getStoreAddons()?.[slug];
					const isExpanded = activeGateway === slug;

					return (
						<div key={slug} className="quillforms-settings-payments-tab__card">
							{/* Icon / name */}
							<div className="quillforms-settings-payments-tab__card-header">
								{typeof icon === 'string' ? (
									<img src={icon} alt={gateway.name} />
								) : (
									<IconComponent icon={icon?.src ? icon.src : icon} size={40} />
								)}
								{/* <div className="quillforms-settings-payments-tab__card-name">
									{gateway.name}
								</div> */}
							</div>

							{/* Description */}
							{gateway.description && (
								<p className="quillforms-settings-payments-tab__card-desc">
									{gateway.description}
								</p>
							)}

							{/* Connect / Settings */}
							{isExpanded && gateway.settings ? (
								<div className="quillforms-settings-payments-tab__card-settings">
									<gateway.settings slug={slug} />
									<CustomButton
										variant="outlineSecondary"
										text={__('← Back', 'quillforms')}
										onClick={() => setActiveGateway(null)}
										className="!w-full !py-2 !px-3 !rounded-[8px] !text-sm !mt-3"
									/>
								</div>
							) : (
								<CustomButton
									variant="outlineSecondary"
									text={__('Connect with', 'quillforms') + ' ' + gateway.name + ' →'}
									onClick={() => setActiveGateway(slug)}
									className="!w-full !py-2 !px-3 !rounded-[8px] !text-sm !mt-3"
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Payments;
