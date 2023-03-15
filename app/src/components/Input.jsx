import styles from '../styles/input.module.scss';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

const Input = (props) => {
	const [inputEmpty, setInputEmpty] = useState(true);
	const [uuid] = useState(uuidv4());

	const HandleInput = (e) => {
		if (e.target.value === '') {
			setInputEmpty(true);
		} else {
			setInputEmpty(false);
		}
		let c = props.onInput(e.target.value);
		if (c) {
			setError(c.error);
			setValid(c.valid);
		}
	};

	const [valid, setValid] = useState(true);
	const [error, setError] = useState('');

	return (
		<div
			className={classNames(
				styles.input__container,
				inputEmpty ? styles.empty : null,
				props.classNames
			)}
		>
			<label htmlFor="" className={styles.label}>
				{props.placeholder}
			</label>
			<input
				className={classNames(styles.input, !valid ? styles.invalid : undefined)}
				onInput={HandleInput}
				onChange={HandleInput}
				list={uuid}
				type={props.type || 'text'}
			/>
			{!valid && <label className={styles.invalidText}>{error ? error : null}</label>}
			{props.dataList && (
				<datalist id={uuid}>
					{props.dataList.map((itm, i) => (
						<option value={itm} key={i} />
					))}
				</datalist>
			)}
			{props.helperText && <label className={styles.helperText}>{props.helperText}</label>}
		</div>
	);
};

export default Input;
