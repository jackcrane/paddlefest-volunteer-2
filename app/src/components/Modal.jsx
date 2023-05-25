import styles from '../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { ExternalLink } from 'tabler-icons-react';
import Input from './Input';
import { F } from './F';
import { Checkbox } from './Checkbox';
import { Locs } from './admin/Locs';
import moment from 'moment';
import ParsePhone from './admin/ParsePhone';
import JobSearchModal from './admin/JobSearchModal';

export const switchForLocation = (location) => {
	switch (location) {
		case 'expo':
			return 'Outdoors for All Expo';
			break;
		case 'putin':
			return 'Launch';
			break;
		case 'launch':
			return 'Launch';
			break;
		case 'midpoint':
			return '4.5 Mile Finish Line / Midpoint';
			break;
		case 'finishline':
			return 'Finish Line Festival';
			break;
		default:
			return location;
	}
};

const Modal = ({ open, onClose, _id, incrementFetchCount }) => {
	const [working, setWorking] = useState(true);
	const [volunteer, setVolunteer] = useState({});

	const [updateTick, setUpdateTick] = useState(0);

	useEffect(() => {
		(async () => {
			setWorking(true);
			let f = await fetch('https://volunteer.jackcrane.rocks'+`https://paddlefestbackend.jackcrane.rocks/volunteer/${_id}`);
			incrementFetchCount();
			let volunteer = await f.json();
			setVolunteer(volunteer);
			await new Promise((r) => setTimeout(r, 500));
			setWorking(false);
		})();
	}, [_id, updateTick]);

	const deleteVolunteer = () => {
		(async () => {
			if (window.confirm('Are you sure you want to delete this volunteer? This is irreversible.')) {
				let f = await fetch('https://volunteer.jackcrane.rocks'+`https://paddlefestbackend.jackcrane.rocks/delete-volunteer`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						_id: _id,
					}),
				});
				incrementFetchCount();
				if (f.status === 200) {
					alert('Volunteer has been deleted.');
					onClose();
				}
			}
		})();
	};

	const [changeSaved, setChangeSaved] = useState('');
	const [notes, setNotes] = useState(volunteer.notes);
	useEffect(() => setNotes(volunteer.notes), [volunteer.notes]);
	const handleNotesChange = async (e) => {
		setChangeSaved('Saving...');
		setNotes(e.target.value);
		let f = await fetch('https://volunteer.jackcrane.rocks'+'https://paddlefestbackend.jackcrane.rocks/update-notes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id: _id,
				notes: e.target.value,
			}),
		});
		incrementFetchCount();
		if (f.status === 200) {
			setChangeSaved('Changes saved');
		} else {
			setChangeSaved('Error saving changes');
		}
	};

	const setLeader = async (state) => {
		let f = await fetch('https://volunteer.jackcrane.rocks'+`https://paddlefestbackend.jackcrane.rocks/set-leader`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id,
				state,
			}),
		});
		incrementFetchCount();
		if (f.status === 200) {
		} else {
			alert(
				`There has been an error (${f.status}) setting the leadership state. Please let Jack know that "error ${f.status} happened"`
			);
		}
	};

	const updateAOR = (aor) => {
		(async () => {
			let f = await fetch('https://volunteer.jackcrane.rocks'+`https://paddlefestbackend.jackcrane.rocks/set-area-of-responsibility`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_id,
					areaOfResponsibility: aor,
				}),
			});
			incrementFetchCount();
			if (f.status === 200) {
				setVolunteer({
					...volunteer,
					areaOfResponsibility: aor,
				});
			} else {
				alert(
					`There has been an error setting the AOR. Please let Jack know that "error ${f.status} happened"`
				);
			}
		})();
	};

	const [jobSearchModalOpen, setJobSearchModalOpen] = useState(false);

	const handleNewJob = async (job) => {
		const f = await fetch('https://volunteer.jackcrane.rocks'+'https://paddlefestbackend.jackcrane.rocks/add-job', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				volunteer: _id,
				job,
			}),
		});
		console.log(f);
	};

	const [textGroup, setTextGroup] = useState(volunteer.textGroup);

	useEffect(() => {
		setTextGroup(volunteer.textGroup);
	}, [volunteer]);

	const [textGroups, setTextGroups] = useState([]);

	const handleTextGroupChange = async (e) => {
		setTextGroup(e.target.value);
		await fetch('https://volunteer.jackcrane.rocks'+'https://paddlefestbackend.jackcrane.rocks/set-text-group', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id,
				textGroup: e.target.value,
			}),
		});
	};

	useEffect(() => {
		(async () => {
			let f = await fetch('https://volunteer.jackcrane.rocks'+'https://paddlefestbackend.jackcrane.rocks/text-groups');
			let textGroups = await f.json();
			console.log(textGroups);
			setTextGroups(textGroups);
		})();
	}, [updateTick]);

	return open ? (
		<>
			<JobSearchModal
				open={jobSearchModalOpen}
				onClose={() => setJobSearchModalOpen(false)}
				onInput={(job) => handleNewJob(job)}
			/>
			<div className={styles.modal}>
				<div className={styles.modalContent}>
					<div className={styles.modalHeader}>
						<h1>Volunteer Details</h1>
						<button onClick={onClose}>Close</button>
					</div>
					<div className={styles.modalBody}>
						{working ? (
							<div className={styles.loading}>
								<Loader />
								<p>Loading information for volunteer {_id}...</p>
								<p>This should not take more than a few moments.</p>
							</div>
						) : (
							<>
								<div className={styles.modalInfo}>
									<table>
										<tbody>
											<tr>
												<td>Name</td>
												<td>{volunteer.name}</td>
											</tr>
											<tr>
												<td>Email</td>
												<td>
													<F>
														{volunteer.email}
														<a href={`mailto:${volunteer.email}`}>
															<ExternalLink height={18} />
														</a>
													</F>
												</td>
											</tr>
											<tr>
												<td>Phone</td>
												<td>
													<F>
														{ParsePhone(volunteer.phonenum)}
														<a href={`tel:${volunteer.phonenum}`}>
															<ExternalLink height={18} />
														</a>
													</F>
												</td>
											</tr>
											<tr>
												<td>Shirt size</td>
												<td>{volunteer.shirt_size.toUpperCase()}</td>
											</tr>
											<tr>
												<td>Volunteer ID number</td>
												<td>
													<code>{_id}</code>
												</td>
											</tr>
											<tr>
												<td>How'd you hear about Paddlefest</td>
												<td>{volunteer.heard_about || 'Data does not exist'}</td>
											</tr>
											<tr>
												<td>Notes</td>
												<td>
													<textarea
														value={notes || ''}
														onInput={handleNotesChange}
														placeholder="No notes yet"
														style={{
															width: '100%',
															height: 100,
															fontFamily: 'inherit',
															fontSize: 16,
														}}
													/>
													<p style={{ margin: 0 }}>{changeSaved}</p>
												</td>
											</tr>
											<tr>
												<td>Text Group</td>
												<td>
													Current text group: {textGroup ? textGroup : 'unset'} <br />
													<br />
													<input
														type="text"
														placeholder="Enter a text group"
														list="groups"
														onInput={handleTextGroupChange}
													/>
													<datalist id="groups">
														{textGroups.map(
															(group) => group && <option key={group} value={group} />
														)}
													</datalist>
												</td>
											</tr>
											<tr>
												<td>Leadership Team</td>
												<td>
													<Checkbox
														checked={volunteer.leader}
														onInput={(state) => setLeader(state)}
													/>
												</td>
											</tr>
											<tr>
												<td>
													Area of Responsibility
													<br />
													(only use if volunteer is a leader)
												</td>
												<td>
													{/* {volunteer.areaOfResponsibility ||
                            "This volunteer has not yet been assigned an area of responsibility"}
                          <Input
                            placeholder="Change area of responsibility"
                            onInput={updateAOR}
                          /> */}
													<textarea
														placeholder="This volunteer has not yet been assigned an area of responsibility. Enter it here."
														onInput={(t) => updateAOR(t.target.value)}
														style={{
															width: '100%',
															height: 50,
															fontFamily: 'inherit',
															fontSize: 16,
														}}
													>
														{volunteer.areaOfResponsibility}
													</textarea>
												</td>
											</tr>
											{volunteer.waiver ? (
												<>
													<tr>
														<td>Waiver type</td>
														<td>{volunteer.waiver.waiverType}</td>
													</tr>
													{volunteer.waiver?.waiverType === 'Minor' && (
														<>
															<tr>
																<td>Minor's DOB</td>
																<td>
																	{new moment(volunteer.waiver.minorDob).format(
																		'MMMM Do YYYY (MM/DD/YYYY)'
																	)}
																</td>
															</tr>
															<tr>
																<td>Parent's email</td>
																<td>{volunteer.waiver.parentEmail}</td>
															</tr>
														</>
													)}
													<tr>
														<td>Emergency Contact</td>
														<td>
															{volunteer.waiver.emergencyName}{' '}
															<F>
																{ParsePhone(volunteer.phonenum)}
																<a href={`tel:${volunteer.phonenum}`}>
																	<ExternalLink height={18} />
																</a>
															</F>{' '}
															<F>
																{volunteer.waiver.emergencyEmail}
																<a href={`mailto:${volunteer.waiver.emergencyEmail}`}>
																	<ExternalLink height={18} />
																</a>
															</F>{' '}
														</td>
													</tr>
												</>
											) : (
												<tr>
													<td>Waiver State</td>
													<td style={{ backgroundColor: 'red', color: 'white' }}>UNSIGNED</td>
												</tr>
											)}
											<tr>
												<td>Debug</td>
												<td>
													<details>
														<summary>Click to show debug data</summary>
														<code>{JSON.stringify(volunteer)}</code>
													</details>
												</td>
											</tr>
										</tbody>
									</table>
									<h2>Selected jobs and shifts</h2>
									<Locs
										jobs={volunteer.jobs}
										volunteer={volunteer._id}
										forceUpdate={() => setUpdateTick(updateTick + 1)}
										openJobSearch={() => setJobSearchModalOpen(true)}
									/>
									<h2>Danger zone</h2>
									<button onClick={deleteVolunteer} className={styles.delete}>
										Delete volunteer
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	) : (
		<></>
	);
};

export default Modal;
