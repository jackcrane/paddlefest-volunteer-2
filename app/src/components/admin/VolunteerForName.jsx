import styles from '../../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import { F } from '../F';

export const VolunteerForName = (props) => {
	const [volunteer, setVolunteer] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/volunteer/${props.volunteer}`);
			let volunteer = await f.json();
			props.incrementFetchCount && props.incrementFetchCount();
			if (volunteer && volunteer.name) {
				setVolunteer(volunteer);
				setLoading(false);
			} else {
				setVolunteer(false);
				setLoading(false);
			}
		})();
	}, [props.volunteer]);
	if (loading) {
		return <span>Loading...</span>;
	}
	return (
		<div className={styles.volunteerName}>
			{volunteer && <F>{props.email ? volunteer.email : volunteer.name}</F>}
		</div>
	);
};
