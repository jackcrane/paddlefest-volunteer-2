import styles from '../styles/signup.module.scss';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

const Option = (props) => {
	const [checked, setChecked] = useState(props.checked);
	const [uuid] = useState(uuidv4());
	const Handle = () => {
		setChecked(!checked);
		props.onLocalChange();
	};
	return (
		<div
			className={classNames(styles.option, checked ? styles.checked : styles.unchecked)}
			onClick={() => Handle()}
		>
			<label className={styles.label} htmlFor={uuid}>
				{props.children}
			</label>
			<input
				type="checkbox"
				className={styles.checkbox}
				onChange={Handle}
				id={uuid}
				checked={checked}
			/>
		</div>
	);
};

const Dates = (props) => {
	const [outdoorsForAll, setOutdoorsForAll] = useState(false);
	const [launch, setLaunch] = useState(false);
	const [midPoint, setMidPoint] = useState(false);
	const [finishLine, setFinishLine] = useState(false);

	const [values, setValues] = useState([]);

	useEffect(() => {
		const newValues = [
			outdoorsForAll && 'outdoorsForAll',
			launch && 'launch',
			midPoint && 'midPoint',
			finishLine && 'finishLine',
		].filter((v) => v);
		console.log(newValues);
		setValues(newValues);
		props.setValues(newValues);
	}, [outdoorsForAll, launch, midPoint, finishLine]);

	return (
		<div>
			<h1>When and where do you want to volunteer?</h1>
			<p>
				Please select from the list of Paddlefest events below, then click “next.” You can select
				multiple events and venues as long as they don’t conflict timewise. (For example, you cannot
				volunteer at both the 4.5 Mile Finish Line/Midpoint AND the Finish Line Festival because
				they happen simultaneously.) After selecting from the events below, you will see available
				roles and shifts on the next page. Please note that volunteer slots for Friday's Outdoors
				for All Expo are full and not shown. Please contact us if you have any questions.
			</p>
			<div className={styles.options}>
				<Option checked={outdoorsForAll} onLocalChange={() => setOutdoorsForAll(!outdoorsForAll)}>
					<p>Friday night (August 2nd)</p>
					<p className={styles.bigdate}>Outdoors for All Expo</p>
					<p>Schmidt Recreation Complex</p>
				</Option>
				<Option checked={launch} onLocalChange={() => setLaunch(!launch)}>
					<p>Saturday early morning (August 3rd)</p>
					<p className={styles.bigdate}>Paddlefest Launch</p>
					<p>Schmidt Recreation Complex</p>
				</Option>
				<Option checked={midPoint} onLocalChange={() => setMidPoint(!midPoint)}>
					<p>Saturday day (August 3rd)</p>
					<p className={styles.bigdate}>4.5 Mile Finish Line / 9.0 Mile Midpoint</p>
					<p>Public Landing (downtown)</p>
				</Option>
				<Option checked={finishLine} onLocalChange={() => setFinishLine(!finishLine)}>
					<p>Saturday day (August 3rd)</p>
					<p className={styles.bigdate}>9.0 Mile Finish Line Festival</p>
					<p>Gilday Park</p>
				</Option>
				{midPoint && finishLine && (
					<p className={styles.error}>
						You cannot work at the Finish Line Festival and 4.5 Mile Finish Line / Midpoint at the
						same time.
					</p>
				)}
			</div>
		</div>
	);
};

export default Dates;
