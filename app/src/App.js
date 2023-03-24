import styles from './styles/signup.module.scss';
import './styles/globals.css';
import classNames from 'classnames';
import { useState } from 'react';
import Start from './components/Start';
import BasicInfo from './components/BasicInfo';
import Jobs from './components/Jobs';
import Dates from './components/Dates';
import Loader from './components/Loader';
import Waiver from './components/Waiver';

const Page = (props) => {
	const [activePage, setActivePage] = useState(0);

	const [_basicInfo, set_BasicInfo] = useState({});
	const [events, setEvents] = useState([]);
	const [jobs, setJobs] = useState([]);

	const [waiver, setWaiver] = useState({});

	const [working, setWorking] = useState(false);

	const submit = async () => {
		setWorking(true);

		// Verify everything is filled out
		if (!_basicInfo.name || !_basicInfo.email || !_basicInfo.phonenum || !_basicInfo.shirt_size) {
			alert('Please fill out all fields');
			setWorking(false);
			setActivePage(1);
			return;
		}
		if (events.length === 0) {
			alert('Please select at least one event');
			setWorking(false);
			setActivePage(2);
			return;
		}
		if (jobs.length === 0) {
			alert('Please select at least one and shift');
			setWorking(false);
			setActivePage(3);
			return;
		}
		if (
			[
				waiver.waiverType == 'Adult' || 'Minor',
				waiver.emergencyName.length > 0,
				waiver.emergencyPhone.length > 0,
				waiver.emergencyEmail.length > 0,
			].some((x) => x === false)
		) {
			alert('Please fill out all waiver fields');
			setWorking(false);
			setActivePage(4);
		}

		let f = await fetch('http://localhost:3100/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				basicInfo: _basicInfo,
				jobs: jobs,
				waiver,
			}),
		});
		setWorking(false);
		console.log(f.status);
		if (f.status === 200) {
			let res = await f.json();
			document.location.href = '/info/registration/' + res.volunteer.id;
		} else if (f.status === 409) {
			alert(
				'Your email and name are already in our database. If you need to modify or would like to re-register, please contact info@ohioriverpaddlefest.org'
			);
		} else if (f.status === 411) {
			alert('Shift not found. It may be full or an error has occured.');
		} else {
			alert('Something went wrong. Make sure everything is present!');
			throw new Error(f);
		}
	};

	const processSetJobs = (_jobs) => {
		setJobs(_jobs);
	};

	return (
		<div className={styles.container}>
			<nav className={styles.sidenav}>
				<img
					src="/paddlefest-logo.png"
					alt="logo"
					onClick={() => (document.location.href = 'https://ohioriverpaddlefest.org')}
				/>
				<h1>Volunteer Signup</h1>
				<div className={styles.navs}>
					<button
						onClick={() => setActivePage(0)}
						className={activePage == 0 ? styles.active : undefined}
					>
						Welcome
					</button>
					<button
						onClick={() => setActivePage(1)}
						className={activePage == 1 ? styles.active : undefined}
					>
						Basic Information
					</button>
					<button
						onClick={() => setActivePage(2)}
						className={activePage == 2 ? styles.active : undefined}
					>
						Event selection
					</button>
					<button
						onClick={() => setActivePage(3)}
						className={activePage == 3 ? styles.active : undefined}
					>
						Job selection
					</button>
					<button
						onClick={() => setActivePage(4)}
						className={activePage == 4 ? styles.active : undefined}
					>
						Waiver
					</button>
					<button
						onClick={() => setActivePage(5)}
						className={activePage == 5 ? styles.active : undefined}
					>
						Submit
					</button>
				</div>
			</nav>
			<main className={styles.main}>
				<div className={styles.content}>
					<div style={{ display: activePage == 0 ? 'initial' : 'none' }}>
						<Start />
					</div>
					<div style={{ display: activePage == 1 ? 'initial' : 'none' }}>
						<BasicInfo setValues={(v) => set_BasicInfo(v)} />
					</div>
					<div style={{ display: activePage == 2 ? 'initial' : 'none' }}>
						<Dates setValues={(v) => setEvents(v)} />
					</div>
					<div style={{ display: activePage == 3 ? 'initial' : 'none' }}>
						<Jobs events={events} handle={(v) => processSetJobs(v)} />
					</div>
					<div style={{ display: activePage == 4 ? 'initial' : 'none' }}>
						<Waiver setValues={(v) => setWaiver(v)} />
					</div>
					<div style={{ display: activePage == 5 ? 'initial' : 'none' }}>
						<h1>Finished?</h1>
						<p>
							Make sure you have everything correct, then click submit below! We will email you a
							copy of your responses.
						</p>
						{working ? <Loader /> : <button onClick={submit}>Submit!</button>}
					</div>
				</div>
				<div className={styles.nav}>
					<button onClick={() => activePage >= 0 && setActivePage(activePage - 1)}>Back</button>
					<button onClick={() => activePage <= 4 && setActivePage(activePage + 1)}>Next</button>
				</div>
			</main>
		</div>
	);
};

export default Page;
