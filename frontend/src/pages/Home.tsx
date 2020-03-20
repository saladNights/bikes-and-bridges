import React from 'react';
import { Link } from 'react-router-dom';
import {useLogoutMutation, useUserQuery, useUsersQuery} from '../generated/graphql';

import {setAccessToken} from '../accessToken';
import RoutesList from './RoutesList';

interface Props {}

const Home: React.FC<Props> = () => {
	const { data } = useUsersQuery({fetchPolicy: 'network-only'});
	const { data: userData } = useUserQuery();
	const [logout, { client }] = useLogoutMutation();

	if (!data) return <div>Loading...</div>;

	return (
		<div>
			<div style={{width: '50%', display: 'inline-block'}}>
				<Link to='/register'>Register</Link>
				<br />
				<Link to='/login'>Login</Link>
				<br />
				{userData && userData.user && <button
					onClick={
						async () => {
							await logout();
							setAccessToken('');
							await client!.resetStore();
						}
					}
				>
					Logout
				</button>}
				<h3>Users:</h3>
				<div>
					<ul>
						{data.users.map((item) => (
							<li key={item.id}>{item.email}</li>
						))}
					</ul>
				</div>
			</div>
			<div style={{width: '50%', display: 'inline-block', verticalAlign: 'top'}}>
				{userData && userData.user && <RoutesList userId={userData.user.id} />}
			</div>
		</div>
	)
};

export default Home;
