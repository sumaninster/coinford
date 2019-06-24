import React from 'react';
import { Table, Icon } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
    var currencyId = this.ApiCoinford.CurrencyId;
    var rateCurrencyId = this.ApiCoinford.RateCurrencyId;
    var currencyName = this.ApiCoinford.getCurrencyObject(currencyId);
    var rateCurrencyName = this.ApiCoinford.getCurrencyObject(rateCurrencyId);
    this.state = {
      OrderList: [],
      loading: false,
      title: this.props.title,
      type: this.props.type,
      orderType: this.props.orderType,
      currencyName: currencyName,
      rateCurrencyName: rateCurrencyName,
    };
  }
  componentDidMount() {
  }
  handleDelete = (text, record) => {
    var orderId = record.Id;
    if(this.state.type == "MY" && this.state.orderType == "BUY") {
      this.ApiCoinford.deleteBuyOrder(orderId, this.updateUi, this.props.homeCallback, this.props.myWallet);
    } else if(this.state.type == "MY" && this.state.orderType == "SELL") {
      this.ApiCoinford.deleteSellOrder(orderId, this.updateUi, this.props.homeCallback, this.props.myWallet);
    }
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(OrderList) {
    var currencyId = this.ApiCoinford.CurrencyId;
    var rateCurrencyId = this.ApiCoinford.RateCurrencyId;
    var currencyName = this.ApiCoinford.getCurrencyObject(currencyId);
    var rateCurrencyName = this.ApiCoinford.getCurrencyObject(rateCurrencyId);

    this.setState({
      loading: false,
      OrderList: OrderList,
      currencyName: currencyName,
      rateCurrencyName: rateCurrencyName,
    });
  }
  render() {
    /*const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };*/
    var amountText = 'Amt. ('+this.state.currencyName.Code+')';
    var rateText = 'Rate ('+this.state.rateCurrencyName.Code+')';
    var totalText = 'Total ('+this.state.rateCurrencyName.Code+')';
    const columns = [{
      title: amountText,
      dataIndex: 'Amount',
      key: 'Amount',
    }, {
      title: rateText,
      dataIndex: 'Rate',
      key: 'Rate',
    }, {
      title: totalText,
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
    }];
    var actionColumn = {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleDelete(text, record)}><Icon type="delete" /></a>
        </span>
      ),
    };
    if(this.state.type == "MY") {
      columns.push(actionColumn);
    }
    var orderTypeColumn = {
      title: 'Type',
      dataIndex: 'OrderType',
      key: 'OrderType',
    };
    if(this.state.type == "MY_TRADES") {
      columns.push(orderTypeColumn);
    }
    return (
      <div>
        <Table
          loading={this.state.loading}
          //bordered
          //rowSelection={rowSelection}
          pagination={false}
          size="small"
          showHeader={true}
          title={() => this.state.title}
          rowKey='Id'
          columns={columns}
          dataSource={this.state.OrderList} />
      </div>
    )
  }
}

module.exports = OrderList;
