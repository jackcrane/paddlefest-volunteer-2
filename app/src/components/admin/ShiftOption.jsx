import styles from '../../styles/Modal.module.scss';
import moment from 'moment';
import classNames from 'classnames';

export const ShiftOption = ({ shift, volunteer, forceUpdate }) => {
	const submit = async () => {
		let f = await fetch('https://volunteer.jackcrane.rocks'+`https://paddlefestbackend.jackcrane.rocks/add-shift`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				shift: shift._id,
				volunteer: volunteer,
			}),
		});
		if (f.status === 200) {
			alert('Shift added!');
			forceUpdate();
		}
	};

	return (
		<div
			className={classNames(
				styles.shift,
				shift.volunteers.includes(volunteer) ? styles.disabled : undefined
			)}
			onClick={submit}
		>
			<p>
				{moment(shift.start).format('h:mm a')} - {moment(shift.end).format('h:mm a')}
			</p>
		</div>
	);
};
