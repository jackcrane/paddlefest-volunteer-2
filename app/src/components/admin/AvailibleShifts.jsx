import styles from '../../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import { ShiftOption } from './ShiftOption';

export const AvailibleShifts = (props) => {
	const [shifts, setShifts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			let f = await fetch(
				`https://paddlefestbackend.jackcrane.rocks/jobs/exchange/job/${props.job}`
			);
			let shifts = await f.json();
			setShifts(shifts.shifts);
			setLoading(false);
		})();
	}, [props.volunteer]);
	if (loading) {
		return <span>Loading...</span>;
	}
	return (
		<div className={styles.addShifts}>
			{shifts.map((shift, i) => (
				<ShiftOption
					key={i}
					volunteer={props.volunteer}
					shift={shift}
					forceUpdate={props.forceUpdate}
				/>
			))}
		</div>
	);
};
