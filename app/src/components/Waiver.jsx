import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../styles/signup.module.scss';
import Input from './Input';

const validatePhone = (phone) => {
	var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
	return re.test(phone);
};

const Waiver = (props) => {
	const [waiverType, setWaiverType] = useState('');
	const [minorName, setMinorName] = useState('');
	const [minorDob, setMinorDob] = useState('');
	const [parentEmail, setParentEmail] = useState('');
	const [emergencyName, setEmergencyName] = useState('');
	const [emergencyPhone, setEmergencyPhone] = useState('');
	const [emergencyEmail, setEmergencyEmail] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		props.setValues({
			waiverType,
			minorName,
			minorDob,
			parentEmail,
			emergencyName,
			emergencyPhone,
			emergencyEmail,
			name,
		});
	}, [
		waiverType,
		minorName,
		minorDob,
		parentEmail,
		emergencyName,
		emergencyPhone,
		emergencyEmail,
		name,
	]);

	return (
		<div className={styles.waiver}>
			<h1>Sign the waiver</h1>
			<div className={styles.waiverText}>
				<p>
					Each volunteer must complete and submit this form to Adventure Crew (AC) prior to
					participating in an AC adventure. Forms of Consent are renewed annually. Individuals
					failing to submit a completed Consent to Participate Form will not be permitted to attend
					an adventure. Participants under the age of 14 must be accompanied by parent or legal
					guardian.
					<br />
					<br />
					<b>Assumption of Risk and Waiver</b>
					<br />
					<br />
					Volunteers with Adventure Crew agree to participate in activities that involve some level
					of risk of personal injury. Despite careful preparation and instruction, not all hazards
					can be foreseen. Each volunteer is solely responsible for determining if he/she is
					physically fit and/or properly skilled for any volunteer activities. It is understood that
					depending upon the volunteer service, the volunteer may assume certain risks to include,
					but not limited to, inclement weather, slips and falls, premises defects, carelessness,
					heavy lifting, injury, equipment and tools, motor vehicles and all other circumstances
					inherent to each and all volunteer AC adventures. Volunteers always have the right to
					refuse a task that makes them uncomfortable and/or refrain from participating in any given
					adventure or its particular activity elements.
					<br />
					<br />
					To the fullest extent permitted by law, I agree to assume the reasonable risk of
					participation in the activities for which I agree to volunteer. In consideration of being
					permitted to participate in the volunteer adventure, I agree to defend and hold harmless,
					Adventure Crew, against any and all claims, demands, suits, losses, including all costs
					connected therewith, for any damage which may be asserted, claimed or recovered against or
					from Adventure Crew and its Board of Directors, employees, partners and all other related
					entities and organizations, by reason of personal injury and death; and property damage,
					including loss of use thereof, which arises out of the alleged negligence of Adventure
					Crew, or in any way connected to or associated with any and all AC volunteer activities
					and adventures. I agree to follow the directions of Adventure Crew and exercise reasonable
					care in all activities in which I participate. I have taken all precautions for my health,
					to include an annual appointment with my physician whereby I feel comfortable
					participating in AC adventures.
					<br />
					<br />
					Additionally, I give full permission to Adventure Crew and their partners/sponsors use of
					all photos, videos and/or other recordings of me that are made during the course of an AC
					Adventure; I understand use includes all electronic and print related mediums strategic to
					the promotion of AC and/or its affiliates.
					<br />
					<br />
					<b>Consent and Release:</b>
					<br />
					<br />
					I have read and fully understand the above and agree to assume the reasonable risk of
					participating in all volunteer activities in which I take part with Adventure Crew within
					one full year of my signature date below.
					<br />
					<br />
					Today's Date: June 18, 2022
					<br />
					<br />
				</p>
			</div>
			<div>
				<div className={styles.signature}>
					<h2>Signature</h2>
					<p>Please select who will be participating...</p>
					<div className={styles.buttonset}>
						<button
							onClick={() => setWaiverType('Adult')}
							className={waiverType == 'Adult' ? styles.active : undefined}
						>
							Adult
						</button>
						<button
							onClick={() => setWaiverType('Minor')}
							className={waiverType == 'Minor' ? styles.active : undefined}
						>
							Minor
						</button>
					</div>
					<p>Sign below to consent to the above document</p>
					{waiverType == 'Adult' ? (
						<div className={styles.adult}>
							<Input placeholder="Your Name" onInput={(e) => setName(e)} />
						</div>
					) : waiverType === 'Minor' ? (
						<div className={styles.minors}>
							<Input placeholder="Minor's Name (first and last)" onInput={setMinorName} />
							<Input
								placeholder="Minor's DOB (mm/dd/yyyy)"
								onInput={(v) => {
									setMinorDob(moment(v));
									if (
										moment(v).isValid() &&
										moment(v).isAfter(moment().subtract(18, 'years')) &&
										moment(v).isBefore(moment())
									) {
										return {
											valid: true,
											error: '',
										};
									} else {
										return {
											valid: false,
											error: 'Invalid DOB or not a minor',
										};
									}
								}}
							/>
							<Input
								placeholder="Parent/Guardian's email address"
								onInput={(v) => {
									setParentEmail(v);
									if (v.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
										return {
											valid: true,
											error: '',
										};
									} else {
										return {
											valid: false,
											error: 'Please enter a valid email address',
										};
									}
								}}
							/>
						</div>
					) : (
						<></>
					)}
					{waiverType !== '' && (
						<>
							<Input placeholder="Emergency Contact Name" onInput={setEmergencyName} />
							<Input
								placeholder="Emergency Contact Phone Number"
								onInput={(v) => {
									setEmergencyPhone(v);
									if (validatePhone(v)) {
										return {
											valid: true,
											error: '',
										};
									} else {
										return {
											valid: false,
											error: 'Please enter a valid phone number',
										};
									}
								}}
							/>
							<Input
								placeholder="Emergency Contact Email"
								onInput={(v) => {
									setEmergencyEmail(v);
									if (v.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
										return {
											valid: true,
											error: '',
										};
									} else {
										return {
											valid: false,
											error: 'Please enter a valid email address',
										};
									}
								}}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Waiver;
