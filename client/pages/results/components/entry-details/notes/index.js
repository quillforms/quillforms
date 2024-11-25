/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import { size, keys } from 'lodash';

const Notes = ({ entry }) => {
    if (!entry.meta?.notes) {
        return <p>{__('No notes yet.', 'quillforms')}</p>;
    }
    const paymenyDetials = entry.meta.payments.value;
    const paymentId = size(keys(paymenyDetials.transactions)) > 0 ? keys(paymenyDetials.transactions)[0] : null;

    return (
        <div className="qf-entry-details__notes">
            {entry.meta?.notes?.value.length > 0 && (
                <>
                    <div className={classnames('qf-entry-payment-detials',
                        css`
                        border-bottom: 1px solid #c6bfbf;
                        padding: 10px;
                        margin-bottom: 10px;
                        .qf-entry-details__payment-details > div {
                            margin-bottom: 10px;
                            span {
                                font-weight: 600;
                            }
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    `
                    )}>
                        <h3>{__('Payment Detials', 'quillforms')}</h3>
                        <div className="qf-entry-details__payment-details">
                            {paymentId && (
                                <div className="qf-entry-details__payment-details__transaction-id">
                                    <span>
                                        {__('Transaction ID', 'quillforms')}:{' '}
                                    </span>
                                    {paymentId}
                                </div>
                            )}
                            <div className="qf-entry-details__payment-details__payment-type">
                                <span>
                                    {__('Payment Type', 'quillforms')}:{' '}
                                </span>
                                {paymenyDetials?.recurring ? __('Recurring', 'quillforms') : __('One Time', 'quillforms')}
                            </div>
                            {paymenyDetials?.recurring && (
                                <>
                                    <div className="qf-entry-details__payment-details__recurring-unit">
                                        <span>
                                            {__('Recurring Unit', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.recurring.interval_unit}
                                    </div>
                                    <div className="qf-entry-details__payment-details__recurring-interval">
                                        <span>
                                            {__('Recurring Interval', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.recurring.interval_count}
                                    </div>
                                </>
                            )}
                            {paymentId && (
                                <>
                                    <div className="qf-entry-details__payment-details__payment-status">
                                        <span>
                                            {__('Payment Status', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.transactions[paymentId].status}
                                    </div>
                                    <div className="qf-entry-details__payment-details__payment-amount">
                                        <span>
                                            {__('Payment Amount', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.transactions[paymentId].amount}
                                    </div>
                                    <div className="qf-entry-details__payment-details__payment-currency">
                                        <span>
                                            {__('Payment Currency', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.transactions[paymentId].currency}
                                    </div>
                                    <div className="qf-entry-details__payment-details__payment-mode">
                                        <span>
                                            {__('Payment Mode', 'quillforms')}:{' '}
                                        </span>
                                        {paymenyDetials.transactions[paymentId].mode}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {entry.meta.notes.value.map((note) => {
                        return (
                            <div
                                className={classnames(
                                    'qf-entry-details__note',
                                    css`
										border-bottom: 1px solid #c6bfbf;
										padding: 10px;
										margin-bottom: 10px;
										> div {
											margin-bottom: 10px;
											span:first-child {
												font-weight: 600;
											}
											&:last-child {
												margin-bottom: 0;
											}
										}
									`
                                )}
                            >
                                <div className="qf-entry-details__note-source">
                                    <span>
                                        {__('Source', 'quillforms')}
                                        :{' '}
                                    </span>
                                    {note.source}
                                </div>
                                <div className="qf-entry-details__note-message">
                                    <span>
                                        {__(
                                            'Message',
                                            'quillforms'
                                        )}
                                        :{' '}
                                    </span>
                                    <span dangerouslySetInnerHTML={{ __html: note.message }} />
                                </div>
                                <div className="qf-entry-details__note-date">
                                    <span>
                                        {__('Date', 'quillforms')}:{' '}
                                    </span>
                                    {note.date}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default Notes;
