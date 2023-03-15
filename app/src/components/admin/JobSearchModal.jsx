import { useState, useEffect } from 'react';
import styles from '../../styles/JobSearchModal.module.scss';
import Input from '../Input';

const JobSearchModal = (props) => {
	const RunFilter = (d) => {
		let filter = query;
		if (filter === '') {
			return d;
		} else {
			return d.filter((v) => JSON.stringify(v).toLowerCase().includes(filter.toLowerCase()));
		}
	};

	const [expoJobs, setExpoJobs] = useState([]);
	const [launchJobs, setLaunchJobs] = useState([]);
	const [midpointJobs, setModpointJobs] = useState([]);
	const [finishlineJobs, setFinishlineJobs] = useState([]);

	useEffect(() => {
		(async () => {
			let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/list-jobs/expo`);
			let ejs = await f.json();
			setExpoJobs(ejs);
		})();
		(async () => {
			let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/list-jobs/launch`);
			let ljs = await f.json();
			setLaunchJobs(ljs);
		})();
		(async () => {
			let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/list-jobs/midpoint`);
			let mjs = await f.json();
			setModpointJobs(mjs);
		})();
		(async () => {
			let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/list-jobs/finishline`);
			let fjs = await f.json();
			setFinishlineJobs(fjs);
		})();
	}, []);

	const [query, setQuery] = useState('');

	return (
		<>
			{props.open ? (
				<div className={styles.jobSearchModal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h2>Search for a job</h2>
							<button onClick={props.onClose}>Close</button>
						</div>
						<Input
							placeholder="Job name or ID"
							onInput={(d) => {
								setQuery(d);
							}}
						/>
						<div className={styles.result}>
							<h3>Expo</h3>
							{RunFilter(expoJobs).map((job, i) => (
								<div key={i} className={styles.job}>
									<div className={styles.jobName} onClick={() => props.onInput(job._id)}>
										{job.title}
									</div>
									<div style={styles.allShiftState}>
										{job.shifts.map((shift, i) => (
											<div className={styles.shiftState} key={i}>
												{shift.volunteers.length} / {shift.max}
											</div>
										))}
									</div>
								</div>
							))}
							<h3>Launch</h3>
							{RunFilter(launchJobs).map((job, i) => (
								<div key={i} className={styles.job}>
									<div className={styles.jobName} onClick={() => props.onInput(job._id)}>
										{job.title}
									</div>
									<div style={styles.allShiftState}>
										{job.shifts.map((shift, i) => (
											<div className={styles.shiftState} key={i}>
												{shift.volunteers.length} / {shift.max}
											</div>
										))}
									</div>
								</div>
							))}
							<h3>Midpoint</h3>
							{RunFilter(midpointJobs).map((job, i) => (
								<div key={i} className={styles.job}>
									<div className={styles.jobName} onClick={() => props.onInput(job._id)}>
										{job.title}
									</div>
									<div style={styles.allShiftState}>
										{job.shifts.map((shift, i) => (
											<div className={styles.shiftState} key={i}>
												{shift.volunteers.length} / {shift.max}
											</div>
										))}
									</div>
								</div>
							))}
							<h3>Finishline</h3>
							{RunFilter(finishlineJobs).map((job, i) => (
								<div key={i} className={styles.job}>
									<div className={styles.jobName} onClick={() => props.onInput(job._id)}>
										{job.title}
									</div>
									<div style={styles.allShiftState}>
										{job.shifts.map((shift, i) => (
											<div className={styles.shiftState} key={i}>
												{shift.volunteers.length} / {shift.max}
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default JobSearchModal;
