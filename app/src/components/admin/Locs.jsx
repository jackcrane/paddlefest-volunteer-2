import { switchForLocation } from '../Modal';
import { Job } from './Job';
import styles from '../../styles/Modal.module.scss';

export const Locs = ({ volunteer, jobs, forceUpdate, openJobSearch }) => {
	// Locations
	return (
		<>
			{Object.keys(jobs).map((loc, i) => {
				return (
					<details key={i}>
						<summary>{switchForLocation(loc)}</summary>
						{Object.keys(jobs[loc]).map((job, i) => (
							<Job volunteer={volunteer} key={i} job={job} forceUpdate={forceUpdate} />
						))}
					</details>
				);
			})}
			<br />
			<button onClick={() => openJobSearch()} className={styles.bluebtn}>
				Add a completely new shift
			</button>
		</>
	);
};
