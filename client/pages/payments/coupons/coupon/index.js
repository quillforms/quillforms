/**
 * QuillForms Dependencies.
 */
import { TextControl, SelectControl, ControlLabel } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import DeleteButton from '../delete-button';

const Coupon = ({ id }) => {
    const { coupons, updateCoupon } = usePaymentsContext();

    const coupon = coupons[id];
    const discountTypOptions = [
        {
            name: __('Percentage (%)', 'quillforms'),
            key: 'percent',
        },
        {
            name: __('Fixed Amount ($)', 'quillforms'),
            key: 'fixed',
        },
    ];

    useEffect(() => {
        if (coupon.discount_type === 'percentage') {
            updateCoupon(id, { discount_type: 'percent' });
        }
    }, []);

    return (
        <div className="coupon">
            <PanelBody
                title={coupon.name || __('New Coupon', 'quillforms')}
                initialOpen={false}
            >
                <div>
                    <ControlLabel
                        label={__('Coupon Name', 'quillforms')}
                        showAsterisk={true}
                    />
                    <TextControl
                        value={coupon.name}
                        onChange={(name) => updateCoupon(id, { name })}
                        placeholder={__('10% off', 'quillforms')}
                        help={__('Enter a name for the coupon here. This is for internal reference only.', 'quillforms')}
                        className="coupon__field__required"
                    />
                </div>
                <div>
                    <ControlLabel
                        label={__('Coupon Code', 'quillforms')}
                        showAsterisk={true}
                    />
                    <TextControl
                        value={coupon.code}
                        onChange={(code) => updateCoupon(id, { code })}
                        placeholder={__('10OFF', 'quillforms')}
                        help={__('Enter the code customers will enter to apply the coupon.', 'quillforms')}
                        className="coupon__field__required"
                    />
                </div>
                <div className="coupon__discount">
                    <ControlLabel
                        label={__('Discount', 'quillforms')}
                        showAsterisk={true}
                    />
                    <div className="coupon__discount__fields">
                        <SelectControl
                            value={discountTypOptions.find(
                                (option) => option.key === coupon.discount_type
                            )}
                            onChange={({ selectedItem }) => {
                                if (selectedItem) {
                                    const { key } = selectedItem;
                                    updateCoupon(id, { discount_type: key })
                                }

                            }}
                            options={discountTypOptions}
                        />
                        <TextControl
                            value={coupon.discount_amount}
                            onChange={(discount_amount) =>
                                updateCoupon(id, { discount_amount })
                            }
                            placeholder={__('10', 'quillforms')}
                        />
                    </div>
                </div>
                <TextControl
                    label={__('Start Date', 'quillforms')}
                    value={coupon.start_date}
                    onChange={(start_date) => updateCoupon(id, { start_date })}
                    type="date"
                />
                <TextControl
                    label={__('End Date', 'quillforms')}
                    value={coupon.end_date}
                    onChange={(end_date) => updateCoupon(id, { end_date })}
                    type="date"
                />
                <TextControl
                    label={__('Usage Limit', 'quillforms')}
                    value={coupon.usage_limit}
                    onChange={(usage_limit) => updateCoupon(id, { usage_limit })}
                    type="number"
                    help={__('How many times the coupon can be used before it is void.', 'quillforms')}
                />
            </PanelBody>
            <DeleteButton id={id} />
        </div>
    );
};

export default Coupon;