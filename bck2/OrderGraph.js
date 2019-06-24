import React from 'react';
import { Avatar } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ApiCoinford from '../class/ApiCoinford';

class OrderGraph extends React.Component {
  constructor(props) {
    super(props)
    //this.handleSuccess = this.handleSuccess.bind(this);
    this.ApiCoinford = new ApiCoinford();
    const data = [
          {CreatedAt: 'Page A', Rate: 4000, Amount: 2400, TotalAmount: 2400},
          {CreatedAt: 'Page B', Rate: 3000, Amount: 1398, TotalAmount: 2210},
          {CreatedAt: 'Page C', Rate: 2000, Amount: 9800, TotalAmount: 2290},
          {CreatedAt: 'Page D', Rate: 2780, Amount: 3908, TotalAmount: 2000},
          {CreatedAt: 'Page E', Rate: 1890, Amount: 4800, TotalAmount: 2181},
          {CreatedAt: 'Page F', Rate: 2390, Amount: 3800, TotalAmount: 2500},
          {CreatedAt: 'Page G', Rate: 3490, Amount: 4300, TotalAmount: 2100},
    ];
    this.state = {
      data: data
    };
  }
  updateUi(data) {
    //console.log(Orders);
    /*data.forEach(function(value,index) {
      console.log(value);
    });*/
    this.setState({ data });
  }
  render() {
    return (
      <LineChart width={600} height={300} data={this.state.data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="CreatedAt"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="Rate" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="Amount" stroke="#82ca9d" />
       <Line type="monotone" dataKey="TotalAmount" stroke="#108ee9" />
      </LineChart>
    )
  }
}
module.exports = OrderGraph;
