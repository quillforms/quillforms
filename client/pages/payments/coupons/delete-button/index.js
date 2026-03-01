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
import TrashIcon from '../../../../components/icon/trash-icon';

const DeleteButton = ({ id }) => {
    const { deleteCoupon } = usePaymentsContext();

    return (
        <div
            className="delete-coupon"
            onClick={() => deleteCoupon(id)}
        >
           <TrashIcon />
        </div>
    );
};

export default DeleteButton;
