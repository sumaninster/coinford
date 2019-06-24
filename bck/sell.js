import React from 'react';
import { Tabs } from 'antd';
import ApiCoinford from '../class/api_coinford';
const TabPane = Tabs.TabPane;

class Sell extends React.Component {
  constructor(props) {
    super(props)
    this.api_coinford = new ApiCoinford();
  }
  callback(key) {
    //console.log(key);
  }
  render() {
    return (
      <Tabs onChange={this.callback} type="card">
        <TabPane tab="BTC" key="BTC">{this.api_coinford.GetUiName()} BTC</TabPane>
        <TabPane tab="ETH" key="ETH">{this.api_coinford.GetUiName()} ETH</TabPane>
        <TabPane tab="BCH" key="BCH">{this.api_coinford.GetUiName()} BCH</TabPane>
      </Tabs>
    )
  }
}
module.exports = Sell;
