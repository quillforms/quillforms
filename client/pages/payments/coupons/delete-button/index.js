/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Icon, border, closeSmall } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';

const DeleteButton = ({ id }) => {
    const { deleteCoupon } = usePaymentsContext();

    return (
        <div
            className="delete-coupon"
            onClick={() => deleteCoupon(id)}
        >
            <Icon icon={closeSmall} />
        </div>
    );
};

export default DeleteButton;
