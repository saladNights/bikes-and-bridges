import React, { Component } from 'react';
import L from 'leaflet';
import {geoPath, geoTransform, json, select, line, curveBasis} from 'd3';

class Map extends Component<any> {
	private map: any;

	componentDidMount(): void {
		function projectPoint(map: any) {
			return function(x: any, y: any) {
				const point = map.latLngToLayerPoint(new L.LatLng(y, x));
				// @ts-ignore
				this.stream.point(point.x, point.y);
			}
		}

		this.map = L.map('map', {
			center: [53.26,34.42],
			zoom: 9,
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}),
			]
		});

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
		routesUrlArr.map(async (item) => {
			const routeData: any = await json(item.url);
			const svg = select(this.map.getPanes().overlayPane).append("svg");
			const g = svg.append("g").attr("class", "leaflet-zoom-hide");
			const transform = geoTransform({point: projectPoint(this.map)});
			const getPath = geoPath().projection(transform);
			const svgLine = line()
				.x((d) => (d[0]))
				.y((d) => (d[1]))
				.curve(curveBasis);
			const smoothPath = (d: any) => {
				// @ts-ignore
				const sp = getPath(d).replace(/M|Z/, '').split('L').map((d) => d.split(','));
				// @ts-ignore
				return svgLine(sp);
			};
			reset();

			function reset() {
				// console.log(svgLine(routeData.features[0].geometry.coordinates[0]));
				// console.log(smoothPath());
				const bounds = getPath.bounds(routeData);
				const topLeft = bounds[0];
				const bottomRight = bounds[1];

				svg.attr('width', bottomRight[0] - topLeft[0])
					.attr('height', bottomRight[1] - topLeft[1])
					.style('left', topLeft[0] + 'px')
					.style('top', topLeft[1] + 'px');

				g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');
				g.append('path');
				g.selectAll('path')
					// .attr('d', `${getPath(routeData)}`)
					.data(routeData.features)
					.attr('d', smoothPath)
					.style('fill', 'none')
					.style('stroke-linejoin', 'round')
					.style('stroke-miterlimit', '2')
					.style('stroke-linecap', 'round')
					.style('stroke-width', '2')
					.style('stroke', 'red');
			}

			this.map.on('zoomend', reset);

			return false;
		});
	}

	render() {
    return (
      <div id='map' style={{ height: 400 }}/>
    )
  }
}

export default Map;
