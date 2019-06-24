import React from 'react';
import { InputNumber, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import ApiCoinford from '../class/api_coinford';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BuySellForm extends React.Component {
  constructor(props) {
    super(props);
    this.updateui = this.updateui.bind(this);
    this.api_coinford = new ApiCoinford();
  }
  state = {
    CurrencyId: 0,
    RateCurrencyId: '',
  };
  componentDidMount() {
  }
  updateui(OrderList) {
    this.props.callback(OrderList)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        /*switch (values.CurrencyId) {
          case '1':
            values.CurrencyId = 1;
            break;
          case '2':
            values.CurrencyId = 2;
            break;
          case '4':
            values.CurrencyId = 4;
            break;
          default:
        }
        switch (values.RateCurrencyId) {
          case '1':
            values.RateCurrencyId = 1;
            break;
          case '2':
            values.RateCurrencyId = 2;
            break;
          case '3':
            values.RateCurrencyId = 3;
            break;
          case '4':
            values.RateCurrencyId = 4;
            break;
          default:
        }*/
        values.CurrencyId = parseInt(values.CurrencyId, 10);
        values.RateCurrencyId = parseInt(values.RateCurrencyId, 10);
        values.OrderType = this.api_coinford.GetOrderType()
        this.api_coinford.Order(values, this.updateui, this.props.homecallback);
      }
    });
  }
  handleCryptoChange = (e) => {
    const CurrencyId = parseInt(e.target.value, 10);
    this.setState({ CurrencyId });
  }
  handleRateCurrencyChange = (e) => {
    const RateCurrencyId = e.target.value;
    this.setState({ RateCurrencyId });
  }
  getAmountMessage(text) {
    return "Please provide an " + text +"!";
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
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
    };
    const { CurrencyId } = this.state;
    const { RateCurrencyId } = this.state;
    const CurrencyOptions = this.api_coinford.CurrencyOptions();
    var ordertype = "";
    var currencyname = "Amount (" + this.api_coinford.GetCurrencyName(CurrencyId) + ")";
    var ratecurrencyname = "Rate ";
    switch (this.api_coinford.GetOrderType()) {
      case 'BUY':
        ordertype = "Buy Currency";
        break;
      case 'SELL':
        ordertype = "Sell Currency";
        break;
      default:
    }
    /*switch (CurrencyId) {
      case '1':
        currencyname = "Amount (Bitcoin)";
        break;
      case '2':
        currencyname = "Amount (Ethereum)";
        break;
      case '4':
        currencyname = "Amount (Bitcoin Cash)";
        break;
      default:
        currencyname = "Amount";
    }
    switch (RateCurrencyId) {
      case '1':
        ratecurrencyname = "Rate (Bitcoin)";
        break;
      case '2':
        ratecurrencyname = "Rate (Ethereum)";
        break;
      case '3':
        ratecurrencyname = "Rate (Canadian Dollar)";
        break;
      case '4':
        ratecurrencyname = "Rate (Bitcoin Cash)";
        break;
      default:
        ratecurrencyname = "Rate";
    }*/
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={ordertype}
        >
          {getFieldDecorator('CurrencyId', {
            rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
          })(
            <RadioGroup onChange={this.handleCryptoChange} options={CurrencyOptions} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Rate Currency"
        >
          {getFieldDecorator('RateCurrencyId', {
            rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
          })(
            <RadioGroup onChange={this.handleRateCurrencyChange}>
              <RadioButton value="3">CAD</RadioButton>
              <RadioButton value="1">BTC</RadioButton>
              <RadioButton value="2">ETH</RadioButton>
              <RadioButton value="4">BCH</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={currencyname}
          hasFeedback
        >
        {getFieldDecorator('Amount', {
          rules: [{ required: true, message: this.getAmountMessage(currencyname),}],
        })(
          <InputNumber
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={ratecurrencyname}
          hasFeedback
        >
          {getFieldDecorator('Rate', {
            rules: [{
              required: true, message: 'Please provide a Rate (Canadian Dollar)!',
            }],
          })(
            <InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">{ordertype}</Button>
        </FormItem>
      </Form>
    )
  }
}
const Order = Form.create()(BuySellForm);
module.exports = Order;
