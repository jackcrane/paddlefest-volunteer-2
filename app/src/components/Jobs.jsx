import classNames from 'classnames';
import moment from 'moment';
import { useState, useEffect } from 'react';
import styles from '../styles/signup.module.scss';

const Signup = (props) => {
	const [selectedShifts, setSelectedShifts] = useState([]);
	const handleShift = (shift) => {
		// Add shift to selectedShifts if it's not already there. If it is, remove it.
		if (selectedShifts.includes(shift)) {
			setSelectedShifts(selectedShifts.filter((s) => s !== shift));
		} else {
			setSelectedShifts([...selectedShifts, shift]);
		}
	};

	useEffect(() => {
		props.handle(selectedShifts);
	}, [selectedShifts]);

	return (
		<div>
			<h1>Select a job and time</h1>
			<p>
				First, select the role you want to have, then choose one or multiple shifts from the
				available times that pop up. Jobs are automatically filtered for the event you have selected
				and are ordered by the most available shifts.
			</p>
			{props.events.length === 0 && (
				<p>
					<strong>You need to select an event on the previous page before choosing jobs.</strong>
				</p>
			)}
			{props.events.map((e, i) => (
				<EventJobs
					key={i}
					event={(() => (e === 'outdoorsForAll' ? 'expo' : e))()}
					handle={handleShift}
				/>
			))}
		</div>
	);
};

const EventJobs = (props) => {
	const [eventCode, setEventCode] = useState(props.event);
	const [event, setEvent] = useState(props.event);
	useEffect(() => {
		switch (props.event) {
			case 'expo':
				setEvent('Outdoors for All Expo');
				break;
			case 'putin':
				setEvent('Launch');
				break;
			case 'launch':
				setEvent('Launch');
				break;
			case 'midpoint':
				setEvent('4.5 Mile Finish Line / Midpoint');
				break;
			case 'finishLine':
				setEvent('Finish Line Festival');
				break;
			default:
				setEvent(props.event);
		}
	}, [props.event]);
	const [jobs, setJobs] = useState([]);

	useEffect(() => {
		setJobs([]);
		(async () => {
			console.log(props.event);
			let jfetch = await fetch(
				'https://volunteer.jackcrane.rocks' + `/jobs?location=${props.event.toLowerCase()}`
			);
			console.log(jfetch.status);
			if (jfetch.status !== 200) {
				alert(
					'Error fetching jobs. Please contact the developer at jack@jackcrane.rocks or 513-628-9360 asap so I can fix it!'
				);
				return;
			} else {
				let jobs = await jfetch.json();
				setJobs(jobs.map((job) => ({ ...job, selectedShifts: [] })));
				console.log(jobs);
			}
		})();
	}, [props.event]);

	return (
		<div>
			<h2>{event}</h2>
			<div className={styles.jobList}>
				{jobs.map((job, i) => (
					<Job key={i} job={job} selectedShifts={job.selectedShifts} handle={props.handle} />
				))}
			</div>
		</div>
	);
};

const Job = (props) => {
	let job = props.job;
	const [selectedShifts, setSelectedShifts] = useState(props.selectedShifts);

	const handleClick = (id) => {
		if (selectedShifts.includes(id)) {
			setSelectedShifts(selectedShifts.filter((shift) => shift !== id));
			props.handle(id);
		} else {
			setSelectedShifts([...selectedShifts, id]);
			props.handle(id);
		}
	};

	const sortByTime = (shifts) => {
		return shifts.sort((a, b) => {
			if (moment(a.startTime).isBefore(moment(b.startTime))) return -1;
			if (moment(a.startTime).isAfter(moment(b.startTime))) return 1;
			return 0;
		});
	};

	return (
		<div className={styles.job}>
			<div className={styles.title}>
				<h3>{job.name}</h3>
				{job.restrictions.length > 0 && (
					<div className={styles.restrictions}>
						{job.restrictions.map((r, i) => (
							<p key={i}>{r.name}</p>
						))}
					</div>
				)}
			</div>
			<div className={styles.description}>
				<p>{job.description}</p>
				<details>
					<summary className={styles.summary}>View Shifts</summary>
					<div className={styles.shifts}>
						{job.shifts ? (
							<>
								{sortByTime(job.shifts).map(
									(shift, i) =>
										shift.volunteers < shift.capacity && (
											<div
												key={i}
												className={classNames(
													styles.shift,
													selectedShifts.includes(shift.id) && styles.selected
												)}
												onClick={() => handleClick(shift.id)}
											>
												{moment(shift.startTime).minutes() === 37 ? (
													<p>Times to be assigned. You can still sign up.</p>
												) : (
													<p>
														{moment(shift.startTime).format('h:mm a')} -{' '}
														{moment(shift.endTime).format('h:mm a')}
													</p>
												)}
											</div>
										)
								)}
								{job.shifts.filter((shift) => shift.volunteers >= shift.capacity).length > 0 && (
									<p>One or more shifts are full and have been automatically hidden.</p>
								)}
							</>
						) : (
							<p>No shifts available for this job</p>
						)}
					</div>
				</details>
			</div>
		</div>
	);
};

export default Signup;
// export { Job };
