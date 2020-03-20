import React, {useEffect, useState} from 'react';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';

import {useRoutesQuery} from '../generated/graphql';
import 'leaflet/dist/leaflet.css';

const RoutesList = (props: any) => {
	const { data, loading } = useRoutesQuery({variables: { userId: props.userId }});
	const [jsonRoutes, setJsonRoutes] = useState<{ [key: string]: [] }>({});
	useEffect(() => {
		const routesUrlArr = [
			{
				id: 'bryansk-zhukovka',
				url: 'http://localhost:4000/routes/bryansk-zhukovka.json',
			},
			{
				id: 'fokino-radica',
				url: 'http://localhost:4000/routes/fokino-radica.json',
			},
		];
		routesUrlArr.map((item) => {
			fetch(item.url)
				.then((response) => response.json())
				.then(
					(responseData) => setJsonRoutes((prevState) => ({
						...prevState,
						[item.id]: responseData.features
					}))
				);
		});
	}, []);

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
			<Map center={[53.26,34.42,]} zoom={8} style={{ height: 300 }}>
				<TileLayer
					id='map'
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{Object.keys(jsonRoutes).map((key) => (
					<GeoJSON
						key={key}
						data={jsonRoutes[key]}
						style={{
							color: 'red',
							weight: 2,
						}}
						onClick={() => console.log('route click')}
					/>
				))}
			</Map>
    </div>
  )
};

export default RoutesList;
