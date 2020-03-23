import React from 'react';

import {useRoutesQuery} from '../generated/graphql';
import Map from './Map';
import 'leaflet/dist/leaflet.css';

const RoutesList = (props: any) => {
	const { data, loading } = useRoutesQuery({variables: { userId: props.userId }});

	if (loading) return <div>Loading...</div>;

	if (!data) return null;

	return (
    <div>
	    <h3>Routes</h3>
	    <ul>
		    {data.getRoutes.map((item) => (
		      <li key={item.id}>
			      <a href={item.location}>{item.title}</a>
		      </li>
		    ))}
	    </ul>
	    <Map />
    </div>
  )
};

export default RoutesList;
