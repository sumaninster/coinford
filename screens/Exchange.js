import React from 'react';
import { Row, Col, Radio, Select } from 'antd';
import Order from './Order';
import CurrencyPair from './CurrencyPair';
import OrderList from './OrderList';
import OrderGraph from './OrderGraph';
import ApiCoinford from '../class/ApiCoinford';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.orderBuys = this.orderBuys.bind(this);
    this.orderSells = this.orderSells.bind(this);
    this.orders = this.orders.bind(this);
    this.myOrderBuys = this.myOrderBuys.bind(this);
    this.myOrderSells = this.myOrderSells.bind(this);
    this.myOrders = this.myOrders.bind(this);
    this.myWallet = this.myWallet.bind(this);

    this.orderBuyRef = this.orderBuyRef.bind(this);
    this.orderSellRef = this.orderSellRef.bind(this);

    this.trades = this.trades.bind(this);
    this.tradeGraph = this.tradeGraph.bind(this);

    this.handleCurrencyBalance = this.handleCurrencyBalance.bind(this);
    this.handleRateCurrencyBalance = this.handleRateCurrencyBalance.bind(this);

    this.onTimeChange = this.onTimeChange.bind(this);
    this.ApiCoinford = new ApiCoinford();

    this.handleCurrencyWallets = this.handleCurrencyWallets.bind(this);
    this.handleRateCurrencyWallets = this.handleRateCurrencyWallets.bind(this);

    var CurrencyId = this.ApiCoinford.CurrencyId;
    var RateCurrencyId = this.ApiCoinford.RateCurrencyId;
    var CurrencyName = this.ApiCoinford.getCurrencyObject(CurrencyId);
    var RateCurrencyName = this.ApiCoinford.getCurrencyObject(RateCurrencyId);

    this.state = {
      CurrencyId: CurrencyId,
      RateCurrencyId: RateCurrencyId,
      CurrencyWalletList: [],
      RateCurrencyWalletList: [],
      CurrencyWallet: [],
      RateCurrencyWallet: [],
      CurrencyBalance: 0,
      RateCurrencyBalance: 0,
      CurrencyName: CurrencyName,
      RateCurrencyName: RateCurrencyName,
      OrderWallet: [],
      DefaultCurrencyWalletId: "",
      DefaultRateCurrencyWalletId: "",
      low: 0,
      high: 0,
      last: 0,
      buyRef: null,
      sellRef: null,
      showMyBuyOrders: false,
      showMySellOrders: false,
    }
    this.listExchange();
    this.ApiCoinford.listTradeHistory("12h", this.trades, this.tradeGraph, this.props.callback);
  }
  trades(low, high, last) {
    this.setState({ low, high, last });
  }
  tradeGraph(orders) {
    this.myOrderGraphRef.updateUi(orders);
  }
  sleep(ms) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
  componentDidMount() {
    //this.loopListExchange();
  }
  async loopListExchange() {
    //var i = 0;
    while (true) {
      await this.sleep(1000);// 1 seconds
      //console.log(i++);
      this.listExchange();
    }
  }
  listExchange() {
    this.ApiCoinford.listExchange(
      this.orderBuys, this.orderSells, this.orders,
      this.myOrderBuys, this.myOrderSells, this.myOrders,
      this.myWallet, this.props.callback
    );
  }
  updateUi() {
    var CurrencyId = this.ApiCoinford.CurrencyId;
    var RateCurrencyId = this.ApiCoinford.RateCurrencyId;
    var CurrencyName = this.ApiCoinford.getCurrencyObject(CurrencyId);
    var RateCurrencyName = this.ApiCoinford.getCurrencyObject(RateCurrencyId);
    this.state.buyRef.initializeOrderForm();
    this.state.sellRef.initializeOrderForm();
    this.setState({ CurrencyId, RateCurrencyId, CurrencyName, RateCurrencyName });
    this.listExchange();
    this.props.callback();
  }
  orderBuys(OrderList) {
    this.orderBuysRef.updateUi(OrderList);
    if(OrderList.length > 0) {
      this.state.sellRef.setOrderRate(OrderList[0].Rate);
    }
  }
  orderSells(OrderList) {
    this.orderSellsRef.updateUi(OrderList);
    if(OrderList.length > 0) {
      this.state.buyRef.setOrderRate(OrderList[0].Rate);
    }
  }
  orders(OrderList) {
    if(OrderList.length > 0) {
      this.ApiCoinford.ProcessedRate = OrderList[0].Rate;
    }
    this.ordersRef.updateUi(OrderList);
  }
  myOrderBuys(OrderList) {
    if(OrderList.length > 0) {
      var showMyBuyOrders = true;
      this.setState({ showMyBuyOrders });
      this.myOrderBuysRef.updateUi(OrderList);
    } else {
      var showMyBuyOrders = false;
      this.setState({ showMyBuyOrders });
    }
  }
  myOrderSells(OrderList) {
    if(OrderList.length > 0) {
      var showMySellOrders = true;
      this.setState({ showMySellOrders });
      this.myOrderSellsRef.updateUi(OrderList);
    } else {
      var showMySellOrders = false;
      this.setState({ showMySellOrders });
    }
  }
  orderBuyRef(buyRef) {
    this.state.buyRef = buyRef;
  }
  orderSellRef(sellRef) {
    this.state.sellRef = sellRef;
  }
  myOrders(OrderList) {
    this.myOrdersRef.updateUi(OrderList);
  }
  myWallet(CurrencyWallets, RateCurrencyWallets, OrderWallet) {
    var CurrencyWallet = [];
    var RateCurrencyWallet = [];
    var DefaultCurrencyWalletId = "";
    var DefaultRateCurrencyWalletId = "";
    CurrencyWallet.Amount = 0
    CurrencyWallet.AmountLocked = 0;
    RateCurrencyWallet.Amount = 0
    RateCurrencyWallet.AmountLocked = 0;

    CurrencyWallets.forEach(function(value,index) {
      if(OrderWallet != null) {
        if(value.Id == OrderWallet.CurrencyWalletId) {
          CurrencyWallet = value;
          DefaultCurrencyWalletId = "" + OrderWallet.CurrencyWalletId;
        }
      } else if(value.Primary == true) {
        CurrencyWallet = value;
        DefaultCurrencyWalletId = "" + value.Id;
      }
    });
    RateCurrencyWallets.forEach(function(value,index) {
      if(OrderWallet != null) {
        if(value.Id == OrderWallet.RateCurrencyWalletId) {
          RateCurrencyWallet = value;
          DefaultRateCurrencyWalletId = "" + OrderWallet.RateCurrencyWalletId;
        }
      } else if(value.Primary == true) {
        RateCurrencyWallet = value;
        DefaultRateCurrencyWalletId = "" + value.Id;
      }
    });
    var CurrencyBalance = 0;
    var RateCurrencyBalance = 0;

    CurrencyBalance = CurrencyWallet.Amount - CurrencyWallet.AmountLocked;
    RateCurrencyBalance = RateCurrencyWallet.Amount - RateCurrencyWallet.AmountLocked;

    this.state.buyRef.setBalance(CurrencyBalance, RateCurrencyBalance, CurrencyWallet, RateCurrencyWallet);
    this.state.sellRef.setBalance(CurrencyBalance, RateCurrencyBalance, CurrencyWallet, RateCurrencyWallet);

    var CurrencyWalletList = this.walletList(CurrencyWallets, this.ApiCoinford.CurrencyId);
    var RateCurrencyWalletList = this.walletList(RateCurrencyWallets, this.ApiCoinford.RateCurrencyId);

    this.setState({ CurrencyWalletList, RateCurrencyWalletList,
      CurrencyWallet, RateCurrencyWallet,
      CurrencyBalance, RateCurrencyBalance,
      OrderWallet, DefaultCurrencyWalletId, DefaultRateCurrencyWalletId });
  }
  initializeWalletList(DefaultCurrencyWalletId, DefaultRateCurrencyWalletId) {
    this.props.form.setFields({
      Amount: {
        value: Amount,
      },
    });
  }
  walletList(WalletList, CurrencyId) {
    var Wallets = [];
    if( WalletList != null) {
      if(WalletList.length > 0) {
        var CurrencyCode = this.ApiCoinford.getCurrencyCode(CurrencyId);
        WalletList.forEach(function(value,index) {
          var Amount = value.Amount - value.AmountLocked;
          var WalletName = value.Nickname + ' (' + Amount + ' ' + CurrencyCode + ')';
          var id = "" + value.Id;
          Wallets.push(<Option key={id}>{WalletName}</Option>);
        });
      }
    }
    return Wallets;
  }
  handleCurrencyBalance() {
    var Amount = this.state.CurrencyBalance;
    this.state.sellRef.setSellAmountChange(Amount);
  }
  handleRateCurrencyBalance() {
    var TotalAmount = this.state.RateCurrencyBalance;
    this.state.buyRef.setBuyAmountChange(TotalAmount);
  }
  onTimeChange(e) {
    this.ApiCoinford.listTradeHistory(e.target.value, this.trades, this.tradeGraph, this.props.callback);
  }
  handleCurrencyWallets(value) {
    var CurrencyWalletId = parseInt(value, 10);
    var DefaultRateCurrencyWalletId = parseInt(this.state.DefaultRateCurrencyWalletId, 10);
    this.ApiCoinford.updateMyOrderWallet(CurrencyWalletId, DefaultRateCurrencyWalletId,
      this.props.homeCallback, this.myWallet);
  }
  handleRateCurrencyWallets(value) {
    var RateCurrencyWalletId = parseInt(value, 10);
    var DefaultCurrencyWalletId = parseInt(this.state.DefaultCurrencyWalletId, 10);
    this.ApiCoinford.updateMyOrderWallet(DefaultCurrencyWalletId, RateCurrencyWalletId,
      this.props.homeCallback, this.myWallet);
  }
  render() {
    return (
      <div>
        <Row gutter={16}>
          <CurrencyPair callback={this.updateUi} homeCallback={this.props.callback}/>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <RadioGroup onChange={this.onTimeChange} defaultValue="12h">
              <RadioButton value="all">All</RadioButton>
              <RadioButton value="1y">1y</RadioButton>
              <RadioButton value="1m">1m</RadioButton>
              <RadioButton value="1w">1w</RadioButton>
              <RadioButton value="1d">1d</RadioButton>
              <RadioButton value="12h">12h</RadioButton>
              <RadioButton value="1h">1h</RadioButton>
            </RadioGroup>
          </Col>
          <Col span={12}>
            Low: {this.state.low} {this.state.RateCurrencyName.Code}
            &nbsp;&nbsp;&nbsp;
            High: {this.state.high} {this.state.RateCurrencyName.Code}
            &nbsp;&nbsp;&nbsp;
            Last Trade: {this.state.last} {this.state.RateCurrencyName.Code}
          </Col>
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <OrderGraph
            homeCallback={this.props.callback}
            ref={(myOrderGraphRef) => { this.myOrderGraphRef = myOrderGraphRef; }} />
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Select
              showSearch
              style={{ width: '40%', marginRight: 8 }}
              size="small"
              defaultValue={this.state.DefaultRateCurrencyWalletId}
              //placeholder="select wallet"
              optionFilterProp="children"
              onChange={this.handleRateCurrencyWallets}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.RateCurrencyWalletList}
            </Select>
            {this.state.RateCurrencyName.Name} :
            ({this.state.RateCurrencyWallet.Amount} - {this.state.RateCurrencyWallet.AmountLocked})
            <a onClick={this.handleRateCurrencyBalance}> {this.state.RateCurrencyBalance} </a>
            {this.state.RateCurrencyName.Code}
          </Col>
          <Col span={12}>
            <Select
              showSearch
              style={{ width: '40%', marginRight: 8 }}
              size="small"
              defaultValue={this.state.DefaultCurrencyWalletId}
              //placeholder="select wallet"
              optionFilterProp="children"
              onChange={this.handleCurrencyWallets}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.CurrencyWalletList}
            </Select>
            {this.state.CurrencyName.Name} :
            ({this.state.CurrencyWallet.Amount} - {this.state.CurrencyWallet.AmountLocked})
            <a onClick={this.handleCurrencyBalance}> {this.state.CurrencyBalance} </a>
            {this.state.CurrencyName.Code}
          </Col>
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Order OrderType="BUY"
            CurrencyId={this.ApiCoinford.CurrencyId}
            RateCurrencyId={this.ApiCoinford.RateCurrencyId}
            homeCallback={this.props.callback}
            callback={this.myOrderBuys}
            orderRef={this.orderBuyRef}
            myWallet={this.myWallet}
            ref={(orderForm1) => { this.orderForm1 = orderForm1; }} />
          </Col>
          <Col span={12}>
            <Order OrderType="SELL"
            CurrencyId={this.ApiCoinford.CurrencyId}
            RateCurrencyId={this.ApiCoinford.RateCurrencyId}
            homeCallback={this.props.callback}
            callback={this.myOrderSells}
            orderRef={this.orderSellRef}
            myWallet={this.myWallet}
            ref={(orderForm2) => { this.orderForm2 = orderForm2; }} />
          </Col>
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <OrderList
            title="Buy Orders"
            type="ALL"
            orderType="BUY"
            homeCallback={this.props.callback}
            callback={this.updateUiList}
            ref={(orderBuysRef) => { this.orderBuysRef = orderBuysRef; }} />
          </Col>
          <Col span={12}>
            <OrderList
            title="Sell Orders"
            type="ALL"
            orderType="SELL"
            homeCallback={this.props.callback}
            callback={this.updateUiList}
            ref={(orderSellsRef) => { this.orderSellsRef = orderSellsRef; }} />
          </Col>
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            {this.state.showMyBuyOrders ? (
              <OrderList
              title="My Buy Orders"
              type="MY"
              orderType="BUY"
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              myWallet={this.myWallet}
              ref={(myOrderBuysRef) => { this.myOrderBuysRef = myOrderBuysRef; }} />
            ) : null}
          </Col>
          <Col span={12}>
            {this.state.showMySellOrders ? (
              <OrderList
              title="My Sell Orders"
              type="MY"
              orderType="SELL"
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              myWallet={this.myWallet}
              ref={(myOrderSellsRef) => { this.myOrderSellsRef = myOrderSellsRef; }} />
            ) : null}
          </Col>
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          &nbsp;
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <OrderList
            title="Recent Trades"
            homeCallback={this.props.callback}
            callback={this.updateUiList}
            ref={(ordersRef) => { this.ordersRef = ordersRef}} />
          </Col>
          <Col span={12}>
            <OrderList
            title="My Recent Trades"
            type="MY_TRADES"
            homeCallback={this.props.callback}
            callback={this.updateUiList}
            ref={(myOrdersRef) => { this.myOrdersRef = myOrdersRef; }} />
          </Col>
        </Row>
      </div>
    )
  }
}
module.exports = Exchange;
