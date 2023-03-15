import styles from '../styles/signup.module.scss';
import classNames from 'classnames';
import { useState } from 'react';

const Page = (props) => {
	const [activePage, setActivePage] = useState(0);

	return (
		<div className={styles.container}>
			<nav className={styles.sidenav}>
				<img src="/paddlefest-logo.png" alt="logo" className={styles.logo} />
				<h1>Volunteer Signup</h1>
				<div className={styles.navs}>
					<button className={activePage == 0 ? styles.active : undefined}>Welcome</button>
				</div>
			</nav>
			<main className={styles.main}>
				<div className={styles.content}>{props.children}</div>
				<div className={styles.nav}>
					<button>Back</button>
					<button>Next</button>
				</div>
			</main>
		</div>
	);
};

export default Page;
