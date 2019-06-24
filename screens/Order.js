import React from 'react';
import { InputNumber, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Modal } from 'antd';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BuySellForm extends React.Component {
  constructor(props) {
    super(props);
    this.updateBuyList = this.updateBuyList.bind(this);
    this.updateSellList = this.updateSellList.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.setOrderForm();
  }
  componentDidMount() {
    this.props.orderRef(this);
  }
  initializeOrderForm() {
    this.setOrderForm();
    this.initializeFields();
  }
  setOrderRate(Rate) {
    if(this.state.Rate == this.state.AutoRate) {
      this.initializeRate(Rate);
      var AutoRate = Rate;
      this.setState({ Rate, AutoRate });
    }
  }
  handleRateChange(Rate) {
    var TotalAmount = 0;
    if(Rate > 0 && this.state.Amount > 0) {
      TotalAmount = this.state.Amount * Rate;
    }
    this.initializeTotalAmount(TotalAmount);
    this.setState({ Rate, TotalAmount });
  }
  handleAmountChange(Amount) {
    var TotalAmount = 0;
    if(Amount > 0 && this.state.Rate > 0) {
      var TotalAmount = this.state.Rate * Amount;
    }
    this.initializeTotalAmount(TotalAmount);
    this.setState({ Amount, TotalAmount });
  }
  setBuyAmountChange(TotalAmount) {
    if(this.state.Rate > 0 && TotalAmount > 0) {
      var Amount = TotalAmount / this.state.Rate;
      this.initializeAmount(Amount);
      this.initializeTotalAmount(TotalAmount);
      this.setState({ Amount, TotalAmount });
    }
  }
  setSellAmountChange(Amount) {
    if(this.state.Rate > 0 && Amount > 0) {
      var TotalAmount = this.state.Rate * Amount;
      this.initializeAmount(Amount);
      this.initializeTotalAmount(TotalAmount);
      this.setState({ Amount, TotalAmount });
    } else if(Amount > 0) {
      this.initializeAmount(Amount);
      this.setState({ Amount });
    }
  }
  setBalance(CurrencyBalance, RateCurrencyBalance, CurrencyWallet, RateCurrencyWallet) {
    this.setState({ CurrencyBalance, RateCurrencyBalance, CurrencyWallet, RateCurrencyWallet });
  }
  initializeAmount(Amount) {
    this.props.form.setFields({
      Amount: {
        value: Amount,
      },
    });
  }
  initializeRate(Rate) {
    this.props.form.setFields({
      Rate: {
        value: Rate,
      },
    });
  }
  initializeTotalAmount(TotalAmount) {
    this.props.form.setFields({
      TotalAmount: {
        value: TotalAmount,
      },
    });
  }
  setOrderForm() {
    var currencyName = "Amount";
    var rateCurrencyName = "Rate";
    var CurrencyId = this.ApiCoinford.CurrencyId;
    var RateCurrencyId = this.ApiCoinford.RateCurrencyId;
    if(CurrencyId > 0) {
      var Currency = this.ApiCoinford.getCurrencyObject(CurrencyId);
      currencyName = "Amount (" + Currency.Code + ")";
    }
    if(RateCurrencyId > 0) {
      var RateCurrency = this.ApiCoinford.getCurrencyObject(RateCurrencyId);
      rateCurrencyName = "Rate (" + RateCurrency.Code + ")";
    }
    var totalCurrencyName = "Total (" + RateCurrency.Code + ")";
    this.setInitialState(currencyName, rateCurrencyName, totalCurrencyName, Currency, RateCurrency);
  }
  setInitialState(currencyName, rateCurrencyName, totalCurrencyName, Currency, RateCurrency) {
    this.state = {
      CurrencyId: this.ApiCoinford.CurrencyId,
      RateCurrencyId: this.ApiCoinford.RateCurrencyId,
      Amount: 0,
      Rate: 0,
      AutoRate: 0,
      TotalAmount: 0,
      CurrencyBalance: 0,
      RateCurrencyBalance: 0,
      CurrencyWallet: [],
      RateCurrencyWallet: [],
      OrderType: this.props.OrderType,
      ordertypename: "",
      currencyName: currencyName,
      rateCurrencyName: rateCurrencyName,
      totalCurrencyName: totalCurrencyName,
      Currency: Currency,
      RateCurrency: RateCurrency,
      visibleConfirm: false,
      rateText: "",
      amountText: "",
      totalAmountText: "",
    };
  }
  updateBuyList(OrderList) {
    this.props.callback(OrderList);
    this.initializeFields();
  }
  updateSellList(OrderList) {
    this.props.callback(OrderList);
    this.initializeFields();
  }
  successOrder() {
    Modal.success({
      title: this.state.ordertypename,
      content: 'The order is successfully placed!',
      okText: "Okay",
    });
  }
  initializeFields() {
    this.props.form.setFields({
      Amount: {
        value: this.state.Amount,
      },
      Rate: {
        value: this.state.Rate,
      },
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var submit = false;
        if(this.state.OrderType == "BUY" && values.Amount * values.Rate <= this.state.RateCurrencyBalance) {
          submit = true;
        }
        if(this.state.OrderType == "SELL" && values.Amount <= this.state.CurrencyBalance) {
          submit = true;
        }
        if(submit) {
          var cname = this.ApiCoinford.getCurrencyObject(this.ApiCoinford.CurrencyId);
          var rcname = this.ApiCoinford.getCurrencyObject(this.ApiCoinford.RateCurrencyId);
          var rateText = "Rate: 1 " + cname.Code + " = " + values.Rate + " " + rcname.Code;
          var amountText = "Amount: " + values.Amount + " " + cname.Code;
          var totalAmountText = "Total: " + (values.Amount*values.Rate) + " " + rcname.Code;

          this.setState({
            Amount: values.Amount,
            Rate: values.Rate,
            CurrencyId: this.ApiCoinford.CurrencyId,
            RateCurrencyId: this.ApiCoinford.RateCurrencyId,
            OrderType: this.props.OrderType,
            ordertypename: this.orderTypeName(),
            rateText: rateText,
            amountText: amountText,
            totalAmountText: totalAmountText,
          });
          values.CurrencyId = this.ApiCoinford.CurrencyId;
          values.RateCurrencyId = this.ApiCoinford.RateCurrencyId;
          //this.showConfirm();
          this.submitOrder(values);
        } else {
          console.log("Insufficient balance");
        }
      }
    });
  }
  submitOrder(values) {
    if(this.props.OrderType == "BUY") {
      this.ApiCoinford.limitBuyOrder(values, this.state.CurrencyWallet.Id, this.state.RateCurrencyWallet.Id, this.updateBuyList, this.props.homeCallback, this.props.myWallet);
    } else if(this.props.OrderType == "SELL") {
      this.ApiCoinford.limitSellOrder(values, this.state.CurrencyWallet.Id, this.state.RateCurrencyWallet.Id, this.updateSellList, this.props.homeCallback, this.props.myWallet);
    }

  }
  showConfirm = () => {
    this.setState({
      visibleConfirm: true,
    });
  }
  handleOkConfirm = (e) => {
    this.setState({
      visibleConfirm: false,
    });
    this.submitOrder();
  }
  handleCancelConfirm = (e) => {
    this.setState({
      visibleConfirm: false,
    });
  }
  getAmountMessage() {
    var message = "Please provide the amount!";
    if(this.state.CurrencyId != 0) {
      message = "Please provide the amount of " + this.ApiCoinford.getCurrencyName(this.state.CurrencyId) +" that you want to "+this.state.OrderType.toLowerCase()+"!";
    }
    return message;
  }
  getRateMessage() {
    var message = "Please provide the rate!";
    if(this.state.RateCurrencyId != 0) {
      message = "Please provide the rate in " + this.ApiCoinford.getCurrencyName(this.state.RateCurrencyId) +"!";
    }
    return message;
  }
  orderTypeName() {
    var cname = this.ApiCoinford.getCurrencyObject(this.state.CurrencyId);
    var ordertypename;
    if (this.state.CurrencyId != 0) {
      ordertypename = this.ApiCoinford.capitalizeFirstLetter(this.state.OrderType);// + " " + cname.Name + " (" + cname.Code + ")";
    } else {
      ordertypename = this.ApiCoinford.capitalizeFirstLetter(this.state.OrderType);
    }
    return ordertypename;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    /*const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };*/
    const { CurrencyId } = this.state;
    const { RateCurrencyId } = this.state;
    const { Amount } = this.state;
    const { Rate } = this.state;
    const { currencyName } = this.state;
    const { rateCurrencyName } = this.state;
    const { totalCurrencyName } = this.state;
    const { rateText } = this.state;
    const { amountText } = this.state;
    const { totalAmountText } = this.state;
    const CurrencyOptions = this.ApiCoinford.currencyOptions(RateCurrencyId);
    const RateCurrencyOptions = this.ApiCoinford.rateCurrencyOptions(CurrencyId);

    var ordertypename = this.orderTypeName();
    var ordername = this.ApiCoinford.capitalizeFirstLetter(this.state.OrderType) + " Currency";

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          //{...formItemLayout}
          label={currencyName}
          //hasFeedback
        >
        {getFieldDecorator('Amount', {
          //rules: [{ required: true, message: this.getAmountMessage(),}],
        })(
          <InputNumber
            onChange={this.handleAmountChange}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )}
        </FormItem>
        <FormItem
          //{...formItemLayout}
          label={rateCurrencyName}
          //hasFeedback
        >
          {getFieldDecorator('Rate', {
            //rules: [{ required: true, message: this.getRateMessage(),}],
          })(
            <InputNumber
              onChange={this.handleRateChange}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem
          //{...formItemLayout}
          label={totalCurrencyName}
          //hasFeedback
        >
          {getFieldDecorator('TotalAmount', {
            //rules: [{ required: true, message: this.getRateMessage(),}],
          })(
            <InputNumber
              onChange={this.handleTotalChange}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem /*{...tailFormItemLayout}*/>
          <Button type="primary" htmlType="submit">{ordertypename}</Button>
        </FormItem>
      </Form>
  )
  }
}
const Order = Form.create()(BuySellForm);
module.exports = Order;
