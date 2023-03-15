import styles from '../../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { VolunteerForName } from './VolunteerForName';
import { AvailibleShifts } from './AvailibleShifts';

export const Shifts = (props) => {
	const [shifts, setShifts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			let f = await fetch(
				`https://paddlefestbackend.jackcrane.rocks/shifts/${props.volunteer}/${props.job}`
			);
			let shifts = await f.json();
			setShifts(shifts);
			setLoading(false);
		})();
	}, [props.volunteer, props.job]);
	if (loading) {
		return <span>Loading...</span>;
	}

	const leaveShift = (shift) => {
		(async () => {
			if (window.confirm('Are you sure you want to remove this shift from this volunteer?')) {
				console.log(shift);
				let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/remove-shift`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						shift: shift._id,
						volunteer: props.volunteer,
					}),
				});
				if (f.status === 200) {
					alert('Shift has been removed from this volunteer.');
					props.forceUpdate();
				}
			}
		})();
	};

	return (
		<div className={styles.shifts}>
			{shifts.map((shift, i) => (
				<div className={styles.shift} key={i}>
					<h3>Shift {i + 1}</h3>
					<table>
						<tbody>
							<tr>
								<td>Start</td>
								<td>{moment(shift.start).format('hh:mm a')}</td>
							</tr>
							<tr>
								<td>End</td>
								<td>{moment(shift.end).format('hh:mm a')}</td>
							</tr>
							<tr>
								<td>Other volunteers</td>
								<td>
									{shift.volunteers.map(
										(volunteer, i) =>
											volunteer !== props.volunteer && (
												<VolunteerForName key={i} volunteer={volunteer} />
											)
									)}
								</td>
							</tr>
						</tbody>
					</table>
					<div className={styles.options}>
						<button onClick={() => leaveShift(shift)} className={styles.remove}>
							Leave this shift
						</button>
					</div>
				</div>
			))}
			<h3>Add a new shift</h3>
			<AvailibleShifts
				volunteer={props.volunteer}
				job={props.job}
				forceUpdate={props.forceUpdate}
			/>
		</div>
	);
};
