import React, { useState, useEffect } from 'react';
import { Layout, Table, Tag, Button, Modal, Progress, Input, Select, Drawer } from 'antd';
import moment from 'moment-timezone';

const { Header, Content } = Layout;
const { Option } = Select;

const API_URL = 'http://localhost:3100/admin';

const App = () => {
	const [volunteers, setVolunteers] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [drawerContent, setDrawerContent] = useState({});

	const [volunteersSearch, setVolunteersSearch] = useState('');
	const [jobsSearch, setJobsSearch] = useState('');
	const [shifts, setShifts] = useState([]);

	const [volunteerDrawerVisible, setVolunteerDrawerVisible] = useState(false);
	const [volunteerDrawerContent, setVolunteerDrawerContent] = useState({});

	const filteredVolunteers = volunteers.filter((volunteer) =>
		JSON.stringify(volunteer).toLowerCase().includes(volunteersSearch.toLowerCase())
	);
	const filteredJobs = jobs.filter((job) =>
		JSON.stringify(job).toLowerCase().includes(jobsSearch.toLowerCase())
	);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const [volunteersRes, jobsRes, shiftsRes] = await Promise.all([
				fetch(`${API_URL}/volunteers`),
				fetch(`${API_URL}/jobs`),
				fetch(`${API_URL}/shifts`),
			]);
			const [volunteersData, jobsData, shiftsData] = await Promise.all([
				volunteersRes.json(),
				jobsRes.json(),
				shiftsRes.json(),
			]);

			setVolunteers(volunteersData);
			setJobs(jobsData);
			setShifts(shiftsData);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const displayShifts = (volunteerShifts, shifts, jobs) => {
		return volunteerShifts.map((volunteerShift) => {
			const shift = shifts.find((shift) => shift.id === volunteerShift.shiftId);
			const job = jobs.find((job) => job.id === shift.jobId);

			return (
				<Tag key={volunteerShift.id}>
					{job && job.location ? `${job.location.name}: ${job.name}` : 'N/A'} (
					{moment(shift.startTime).tz('America/New_York').format('h:mm A')} -{' '}
					{moment(shift.endTime).tz('America/New_York').format('h:mm A')})
				</Tag>
			);
		});
	};

	const displayJobShifts = (shifts) => {
		return shifts.map((shift) => (
			<Tag key={shift.id}>
				{moment(shift.startTime).tz('America/New_York').format('h:mm A')} -{' '}
				{moment(shift.endTime).tz('America/New_York').format('h:mm A')} ({shift.volunteers.length}/
				{shift.capacity})
			</Tag>
		));
	};

	const openDrawer = (record) => {
		setDrawerContent(record);
		setDrawerVisible(true);
	};

	const closeDrawer = () => {
		setDrawerVisible(false);
	};

	const openVolunteerDrawer = (record) => {
		setVolunteerDrawerContent(record);
		setVolunteerDrawerVisible(true);
	};

	const closeVolunteerDrawer = () => {
		setVolunteerDrawerVisible(false);
	};

	return (
		<Layout>
			<Header style={{ color: 'white', fontSize: '24px' }}>Paddlefest volunteer admin panel</Header>
			<Content style={{ padding: '50px' }}>
				<h2>Volunteers</h2>
				{/* Volunteers table */}
				<Input.Search
					placeholder="Search Volunteers"
					style={{ width: 200, marginBottom: 16 }}
					onChange={(e) => setVolunteersSearch(e.target.value)}
				/>
				<Table
					dataSource={filteredVolunteers}
					rowKey="id"
					loading={loading}
					pagination={{ pageSize: 5 }}
				>
					<Table.Column
						title="Name"
						dataIndex="name"
						key="name"
						render={(name, record) => (
							<span style={{ cursor: 'pointer' }} onClick={() => openVolunteerDrawer(record)}>
								{name}
							</span>
						)}
					/>
					<Table.Column title="Email" dataIndex="email" key="email" />
					<Table.Column title="Phone" dataIndex="phone" key="phone" />
					<Table.Column title="Shirt Size" dataIndex="shirtSize" key="shirtSize" />
					<Table.Column title="Referral" dataIndex="referral" key="referral" />
					<Table.Column
						title="Jobs"
						dataIndex="shifts"
						key="shifts"
						render={(volunteerShifts) => displayShifts(volunteerShifts, shifts, jobs)}
					/>
				</Table>

				<h2>Jobs</h2>
				{/* Jobs table */}
				<Input.Search
					placeholder="Search Jobs"
					style={{ width: 200, marginBottom: 16 }}
					onChange={(e) => setJobsSearch(e.target.value)}
				/>
				<Table
					dataSource={filteredJobs}
					rowKey="id"
					loading={loading}
					pagination={{ pageSize: 5 }}
					onRow={(record) => ({ onClick: () => openDrawer(record) })}
				>
					<Table.Column title="Name" dataIndex="name" key="name" />
					<Table.Column
						title="Location"
						dataIndex="location"
						key="location"
						render={(location) => location.name}
					/>
					<Table.Column title="Description" dataIndex="description" key="description" />
					<Table.Column
						title="Shifts"
						dataIndex="shifts"
						key="shifts"
						render={displayJobShifts}
						sorter={(a, b) => {
							const aAverage =
								a.shifts.reduce((acc, shift) => acc + shift.volunteers.length / shift.capacity, 0) /
								a.shifts.length;
							const bAverage =
								b.shifts.reduce((acc, shift) => acc + shift.volunteers.length / shift.capacity, 0) /
								b.shifts.length;
							return aAverage - bAverage;
						}}
					/>
				</Table>

				{/* Drawer for Job details */}
				<Drawer title={drawerContent.name} visible={drawerVisible} onClose={closeDrawer}>
					<h3>Description</h3>
					<p>{drawerContent.description}</p>
					<h3>Location</h3>
					<p>{drawerContent.location?.name}</p>
					<h3>Shifts</h3>
					{/* Shifts sub-drawer */}
					{drawerContent.shifts?.map((shift) => (
						<div key={shift.id}>
							<h4>
								{moment(shift.startTime).tz('America/New_York').format('h:mm A')} -{' '}
								{moment(shift.endTime).tz('America/New_York').format('h:mm A')} (
								{shift.volunteers.length}/{shift.capacity})
							</h4>
							<p>Volunteers:</p>
							<ul>
								{shift.volunteers.map((volunteer) => (
									<li key={volunteer.id}>{volunteer.name}</li>
								))}
							</ul>
						</div>
					))}
				</Drawer>
				{/* Volunteer drawer */}
				<Drawer
					title={volunteerDrawerContent.name}
					visible={volunteerDrawerVisible}
					onClose={closeVolunteerDrawer}
				>
					{/* Volunteer details */}
					<h3>Email</h3>
					<Input defaultValue={volunteerDrawerContent.email} />
					<h3>Phone</h3>
					<Input defaultValue={volunteerDrawerContent.phone} />
					<h3>Shirt Size</h3>
					<Select defaultValue={volunteerDrawerContent.shirtSize} style={{ width: '100%' }}>
						<Option value="S">S</Option>
						<Option value="M">M</Option>
						<Option value="L">L</Option>
						<Option value="XL">XL</Option>
					</Select>
					<h3>Referral</h3>
					<Input defaultValue={volunteerDrawerContent.referral} />
					<h3>Jobs</h3>

					{/* Jobs sub-drawer */}
					{volunteerDrawerContent.shifts?.map((volunteerShift) => {
						const shift = shifts.find((shift) => shift.id === volunteerShift.shiftId);
						const job = jobs.find((job) => job.id === shift.jobId);

						return (
							<Drawer key={volunteerShift.id} title={job?.name} width="80%" closable={false}>
								{/* Job details */}
								<h3>Description</h3>
								<Input defaultValue={job?.description} />
								<h3>Location</h3>
								<Input defaultValue={job?.location?.name} />
								<h3>Shifts</h3>
								{/* Shifts details */}
								<h4>
									{moment(shift.startTime).tz('America/New_York').format('h:mm A')} -{' '}
									{moment(shift.endTime).tz('America/New_York').format('h:mm A')} (
									{shift.volunteers.length}/{shift.capacity})
								</h4>
								<p>Volunteers:</p>
								<ul>
									{shift.volunteers.map((volunteer) => (
										<li key={volunteer.id}>{volunteer.name}</li>
									))}
								</ul>
							</Drawer>
						);
					})}
					{/* Updated within last 15 minutes */}
				</Drawer>
			</Content>
		</Layout>
	);
};

export default App;
