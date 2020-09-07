import Logo from '../../logo';
import './style.scss';
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { Icon, plusCircle, arrowUp, chevronUp } from '@wordpress/icons';

const Home = () => {
	return (
		<div className="quillforms-home-page">
			<h1 className="quillforms-home-page__heading">All Forms</h1>
			<div className="quillforms-home-page__all-forms">
				<Card className="quillforms-home-page__add-form-card">
					<CardBody className="quillforms-home-page__add-form-card-body">
						<Icon
							className="quillforms-home-page__add-form-card-icon"
							icon={ plusCircle }
							size={ 30 }
						/>
						Add New
					</CardBody>
				</Card>
				<Card className="quillforms-home-page__empty-form-card"></Card>
				<Card className="quillforms-home-page__form-card">
					<CardBody className="quillforms-home-page__form-card-body">
						Sometime
					</CardBody>
					<CardDivider />
					<CardHeader className="quillforms-home-page__form-card-footer">
						No Responses
					</CardHeader>
				</Card>
			</div>
		</div>
	);
};

export default Home;
