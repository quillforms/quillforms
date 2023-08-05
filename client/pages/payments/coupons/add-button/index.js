/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Icon, plusCircle } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import { getCouponDefaultState, randomId } from '../../utils';

const AddButton = () => {
    const { addCoupon } = usePaymentsContext();

    return (
        <Button
            className="add-coupon"
            isPrimary
            onClick={() => addCoupon(randomId(), getCouponDefaultState())}
        >
            <Icon icon={plusCircle} />
            {__('Add Coupon', 'quillforms')}
        </Button>
    );
};

export default AddButton;
