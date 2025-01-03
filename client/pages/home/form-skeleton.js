// FormsSkeleton.js
import { Card } from '@wordpress/components';
export const FormsSkeleton = ({ viewMode }) => {
    if (viewMode === 'list') {
        return (
            <div className="form-card-skeleton form-card-skeleton--list">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="skeleton-row">
                        <div className="title-cell">
                            <div className="thumbnail-skeleton"></div>
                            <div className="title-skeleton"></div>
                        </div>
                        <div className="responses-cell">
                            <div className="text-skeleton"></div>
                        </div>
                        <div className="date-cell">
                            <div className="text-skeleton"></div>
                        </div>
                        <div className="actions-cell">
                            <div className="actions-skeleton"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <>
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className={`form-card-skeleton form-card-skeleton--${viewMode}`}>
                    <div className="form-card-skeleton__preview"></div>
                    <div className="form-card-skeleton__content">
                        <div className="form-card-skeleton__title"
                            style={{ width: '70%', height: '24px' }}
                        ></div>
                        <div className="form-card-skeleton__meta"
                            style={{ width: '40%', height: '16px' }}
                        ></div>
                        <div className="form-card-skeleton__actions"
                            style={{ width: '30%', height: '32px' }}
                        ></div>
                    </div>
                </Card>
            ))}
        </>
    );
};

// FormCardSkeleton.js (for individual card loading states)
export const FormCardSkeleton = ({ viewMode }) => {
    return (
        <Card className={`form-card-skeleton form-card-skeleton--${viewMode}`}>
            <div className="form-card-skeleton__preview"></div>
            <div className="form-card-skeleton__content">
                <div className="form-card-skeleton__title"></div>
                <div className="form-card-skeleton__meta"></div>
                <div className="form-card-skeleton__actions"></div>
            </div>
        </Card>
    );
};