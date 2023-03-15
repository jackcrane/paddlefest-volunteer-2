import styles from '../styles/ProgressBar.module.scss';

const ProgressBar = (props) => {
	return (
		<div className={styles.progressBar}>
			<div className={styles.progress} style={{ width: `${props.width}%` }} />
			<p className={styles.label}>{props.width}% full</p>
		</div>
	);
};

export default ProgressBar;
