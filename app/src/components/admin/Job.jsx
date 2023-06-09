import styles from '../../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import { F } from '../F';
import { Shifts } from './Shifts';

export const Job = (props) => {
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			console.log(props.job);
			let f = await fetch('https://volunteer.jackcrane.rocks'+
				`https://paddlefestbackend.jackcrane.rocks/jobs/exchange/job/${props.job}`
			);
			let job = await f.json();
			setJob(job);
			setLoading(false);
		})();
	}, [props.job]);
	if (loading) {
		return <span>Loading...</span>;
	}
	return (
		<details className={styles.jobTitle}>
			<summary>{job.title}</summary>
			<div className={styles.jobLocation}>
				<F></F>
				<Shifts job={job._id} volunteer={props.volunteer} forceUpdate={props.forceUpdate} />
			</div>
		</details>
	);
};
