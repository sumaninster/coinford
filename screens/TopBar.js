import React from 'react';
import { Button, Row, Col, Icon, Tag } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class TopBar extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.logout = this.logout.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  updateUi() {
  }
  logout() {
    this.ApiCoinford.logout(this.props.callback);
  }
  render() {
    var cname = this.ApiCoinford.getCurrencyObject(this.ApiCoinford.CurrencyId);
    var rcname = this.ApiCoinford.getCurrencyObject(this.ApiCoinford.RateCurrencyId);
    var cpair = "";
    if(this.ApiCoinford.ProcessedRate > 0) {
      cpair = cname.Code + "/" + rcname.Code;// + " " + this.ApiCoinford.ProcessedRate;
    } else {
      cpair = cname.Code + "/" + rcname.Code;
    }
    return (
      <Row>
        <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }} md={{ span: 10, offset: 1 }} lg={{ span: 14, offset: 1 }} xl={{ span: 14, offset: 1 }}>
          <img src="image/clogo.png" />
          &nbsp;&nbsp;
          Testnet
        </Col>
        <Col xs={{ span: 6, offset: 0 }} sm={{ span: 6, offset: 0 }} md={{ span: 6, offset: 0 }} lg={{ span: 6, offset: 0 }} xl={{ span: 6, offset: 0 }}>
          {this.ApiCoinford.isUserLogin() ? (
            <Button onClick={this.logout} style={{align: 'right'}}><Icon type="logout" />Logout</Button>
          ) : null}
          &nbsp;&nbsp;
          {this.ApiCoinford.isUserLogin() ? (
            this.ApiCoinford.UserName
          ) : null}
          &nbsp;&nbsp;
          {this.ApiCoinford.CurrencyId != 0 && this.ApiCoinford.RateCurrencyId !=0 ? (
            <Tag color="#108ee9">{cpair}</Tag>
          ) : null}
        </Col>
      </Row>
    )
  }
}
module.exports = TopBar;
