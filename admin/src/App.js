import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
const endpoint = 'http://localhost:3100';

const Header = styled.div``;
const Table = styled.table`
	border: 1px solid black;
	border-collapse: collapse;
`;
const Tr = styled.tr`
	border: 1px solid black;
`;
const Th = styled.th`
	border: 1px solid black;
	padding: 5px;
`;
const Td = styled(Th)`
	font-weight: normal;
`;
const Pill = styled.span`
	display: inline-block;
	padding: 5px;
	border-radius: 5px;
	background-color: #eee;
	border: 1px solid #ccc;
	margin-right: 5px;
	font-size: 12px;
	margin: 2px;
`;

const ModalBg = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.5);
	width: 100%;
	height: 100%;
	display: ${(props) => (props.open ? 'block' : 'none')};
`;
const ModalContent = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	padding: 20px;
	border-radius: 5px;
	width: 50%;
	@media screen and (max-width: 850px) {
		width: 80%;
	}
	height: 80%;
	overflow-y: auto;
`;
const Modal = ({ open, children }) => {
	return (
		<ModalBg open={open}>
			<ModalContent>{children}</ModalContent>
		</ModalBg>
	);
};
const P = styled.p`
	margin-top: 5px;
	margin-bottom: 5px;
`;
const Hr = styled.hr`
	margin-top: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
`;
const H4 = styled.h4`
	margin-top: 5px;
	margin-bottom: 5px;
`;
const BorderScan = styled.span`
	border: 1px dashed transparent;
	transition: 0.1s;
	border-bottom: 1px dashed #ccc;
	&:hover {
		border: 1px dashed #ccc;
		background-color: #ddd;
	}
	cursor: pointer;
	background-color: #eee;
	padding: 1px 4px;
	border-radius: 5px;
`;

const shiftsByJob = (shifts) => {
	const jobs = [];
	shifts.forEach((shift) => {
		const job = jobs.find((job) => job.id === shift.shift.job.id);
		if (job) {
			job.shifts.push(shift);
		} else {
			jobs.push({
				id: shift.shift.job.id,
				name: shift.shift.job.name,
				location: shift.shift.job.location,
				shifts: [shift.shift],
			});
		}
	});
	return jobs;
};

const VolunteerModal = ({ modalData, setModalOpen, refreshVolunteerData }) => {
	const report = (key, value) => {
		return (
			<BorderScan
				onClick={async () => {
					let newValue = prompt(`Update value '${key}'`, value);
					if (newValue) {
						const res = await fetch(`${endpoint}/admin/volunteers/${modalData.id}`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								id: modalData.id,
								[key]: newValue,
							}),
						});
						if (res.ok) {
							refreshVolunteerData();
							alert('Successfully updated!');
						} else {
							alert('Error updating value');
						}
					}
				}}
			>
				{value}
			</BorderScan>
		);
	};

	return (
		<>
			<button onClick={() => setModalOpen(false)}>Close</button>
			<br />
			<br />
			{
				// If the updatedAt is more recent (with a 30 second buffer) updated than the emailedAt, then the volunteer has been updated since the last email. show a button
				new Date(modalData.updatedAt) - new Date(modalData.emailedAt) > 30000 && (
					<div
						style={{
							borderLeft: '5px solid red',
							padding: 5,
							paddingLeft: 10,
							backgroundColor: 'rgba(255,0,0,0.2)',
						}}
					>
						<P>
							The user's profile has been updated since their most recent email. It may be a good
							idea to send them an updated email for their planning.
						</P>
						<button
							onClick={async () => {
								const res = await fetch(`${endpoint}/admin/update-volunteer`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										id: modalData.id,
									}),
								});
								if (res.ok) {
									alert('Successfully sent email!');
								} else {
									alert('Error sending email');
									console.log(await res.text());
								}
								refreshVolunteerData();
							}}
						>
							Send email
						</button>
					</div>
				)
			}
			<h2>Volunteer details</h2>
			<P>Name: {report('name', modalData.name)}</P>
			<P>Email: {report('email', modalData.email)}</P>
			<P>Phone: {report('phone', modalData.phone)}</P>
			<P>Shirt Size: {report('shirtSize', modalData.shirtSize)}</P>
			<P>
				Emergency Contact name:{' '}
				{report('emergencyContactName', modalData.Waiver[0].emergencyContactName)}
			</P>
			<P>
				Emergency Contact phone:{' '}
				{report('emergencyContactPhone', modalData.Waiver[0].emergencyContactPhone)}
			</P>
			<Hr />
			<h2>Waiver</h2>
			<P>Waiver type: {modalData.Waiver[0].type}</P>
			{modalData.Waiver[0].type === 'MINOR' && (
				<>
					<P>Parent name: {modalData.Waiver[0].minor__parentName}</P>
					<P>Parent email: {modalData.Waiver[0].minor__guardianEmail}</P>
					<P>Volunteer DOB: {modalData.Waiver[0].minor__DOB}</P>
				</>
			)}
			<P>
				Signed at:{' '}
				{moment(modalData.Waiver[0].signedAt).utc().tz('America/New_York').format('MMM Do YYYY')}
			</P>
			<Hr />
			<h2>Shifts</h2>
			{shiftsByJob(modalData.shifts).map((shift) => (
				<>
					<H4>{shift.name}</H4>
					<P>
						{shift.location.name} | {shift.location.address}
					</P>
					{shift.shifts.map((shift) => (
						<>
							<Pill>
								{moment(shift.startTime).utc().tz('America/New_York').format('h:mm A')} -{' '}
								{moment(shift.endTime).utc().tz('America/New_York').format('h:mm A')}
							</Pill>
						</>
					))}
					<br />
				</>
			))}
			<Hr />
			<h2>Debug</h2>
			{JSON.stringify(modalData, null, 2)}
		</>
	);
};

const VolunteerTable = () => {
	const [volunteers, setVolunteers] = useState([]);

	const refreshVolunteerData = async () => {
		const res = await fetch(`${endpoint}/admin/volunteers`);
		const data = await res.json();
		setVolunteers(data);
		if (modalData.id) {
			setModalData(data.find((volunteer) => volunteer.id === modalData.id));
		}
	};

	useEffect(() => {
		(async () => {
			const res = await fetch(`${endpoint}/admin/volunteers`);
			const data = await res.json();
			setVolunteers(data);
		})();
	}, []);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	return (
		<>
			<Table>
				<Tr>
					<Th>Name</Th>
					<Th>Email</Th>
					<Th>Phone</Th>
					<Th>Shifts</Th>
				</Tr>
				{volunteers.map((volunteer) => (
					<Tr
						onClick={() => {
							setModalData(volunteer);
							setModalOpen(true);
						}}
					>
						<Td>{volunteer.name}</Td>
						<Td>{volunteer.email}</Td>
						<Td>{volunteer.phone}</Td>
						<Td>{volunteer.shifts.length}</Td>
					</Tr>
				))}
			</Table>
			<Modal open={modalOpen} data-modal-data={JSON.stringify(modalData)}>
				{modalData && (
					<VolunteerModal
						modalData={modalData}
						setModalOpen={setModalOpen}
						refreshVolunteerData={refreshVolunteerData}
					/>
				)}
			</Modal>
		</>
	);
};

const App = () => {
	return (
		<>
			<Header>
				<h1>Header</h1>
				<VolunteerTable />
			</Header>
		</>
	);
};

export default App;
