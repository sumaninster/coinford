import React from 'react';
import { InputNumber, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Modal } from 'antd';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CurrencyPairForm extends React.Component {
  constructor(props) {
    super(props);
    //this.updateUi = this.updateUi.bind(this);
    //this.submitOrder = this.submitOrder.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.state = {
      CurrencyId: this.ApiCoinford.CurrencyId,
      RateCurrencyId: this.ApiCoinford.RateCurrencyId,
    };
    this.initialState = this.state;
  }
  initializeFields() {
    this.props.form.setFields({
      CurrencyId: {
        value: this.ApiCoinford.CurrencyId,
      },
      RateCurrencyId: {
        value: this.ApiCoinford.RateCurrencyId,
      },
    });
  }
  handleCryptoChange = (e) => {
    const CurrencyId = parseInt(e.target.value, 10);
    if(CurrencyId != 0) {
      this.setState({ CurrencyId });
      this.ApiCoinford.CurrencyId = CurrencyId;
      this.ApiCoinford.updateMyCurrencyPair(this.props.homeCallback);
      this.props.callback();
    }
  }
  handleRateCurrencyChange = (e) => {
    const RateCurrencyId = parseInt(e.target.value, 10);
    if(RateCurrencyId != 0) {
      this.setState({ RateCurrencyId });
      this.ApiCoinford.RateCurrencyId = RateCurrencyId;
      this.ApiCoinford.updateMyCurrencyPair(this.props.homeCallback);
      this.props.callback();
    }
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
    };/*
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
    const CurrencyOptions = this.ApiCoinford.currencyOptions(RateCurrencyId);
    const RateCurrencyOptions = this.ApiCoinford.rateCurrencyOptions(CurrencyId);
    const CurrencyIdKey = '' + CurrencyId;
    const RateCurrencyIdKey = '' + RateCurrencyId;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Trade"
        >
          {getFieldDecorator('CurrencyId', {
            //rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
            initialValue: CurrencyIdKey,
          })(
            <RadioGroup onChange={this.handleCryptoChange} options={CurrencyOptions}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Rate Currency"
        >
          {getFieldDecorator('RateCurrencyId', {
            //rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
            initialValue: RateCurrencyIdKey,
          })(
            <RadioGroup onChange={this.handleRateCurrencyChange} options={RateCurrencyOptions}/>
          )}
        </FormItem>
      </Form>
    )
  }
}
const CurrencyPair = Form.create()(CurrencyPairForm);
module.exports = CurrencyPair;
