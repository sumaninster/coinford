
import React from 'react';
import { render } from 'react-dom';
import Chart from '../class/Chart';
import { getData } from "../class/utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


class OrderGraph extends React.Component {
	componentDidMount() {
		getData().then(data => {
			//console.log(data);
			this.setState({ data })
		})
	}
  updateUi(data) {
    //console.log(Orders);
    /*data.forEach(function(value,index) {
      console.log(value);
    });*/
    //this.setState({ data });
  }
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}
module.exports = OrderGraph;
