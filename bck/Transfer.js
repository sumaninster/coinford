import React from 'react';
import { Tabs, Form, Input, Button, Select, Tooltip, Icon, Checkbox, Radio} from 'antd';
import WalletList from './WalletList';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TransferForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    this.notify = this.notify.bind(this);
    this.Currencies = this.Currencies.bind(this);
    this.myCurrencies = this.myCurrencies.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.onChangeCurrencyType = this.onChangeCurrencyType.bind(this);
    this.handlePayeeChange = this.handlePayeeChange.bind(this);
    this.listPayee = this.listPayee.bind(this);
    const panes = this.initialPanes();
    this.initialState(panes);
  }
  initialState(panes) {
    this.state = {
      panes: panes,
      TransferType: '',
      CurrencyType: '',
      CurrencyId: 0,
      CurrencyListShow: false,
      CurrencyList: [],
      FromAccountShow: false,
      FromAccountList: [],
      FromAccountLabel: '',
      PayeeShow: false,
      PayeeList: [],
      PayeeLabel: '',
      AmountShow: false,
      ButtonShow: false,
    };
  }
  initialPanes() {
    const panes = [];
    return panes;
  }
  componentDidMount() {
    this.ApiCoinford.listFundTransfer(this.myCurrencies, this.props.callback);
  }
  Currencies(CurrencyType) {
    var Currencies = [];
    var CurrencyList = [];
    var showCurrencyList = false;
    switch (CurrencyType) {
      case "FIAT":
        CurrencyList = this.ApiCoinford.FiatCurrencies;
        break;
      case "CRYPTO":
        CurrencyList = this.ApiCoinford.CryptoCurrencies;
        break;
      default:
    }
    if(CurrencyList.length > 0) {
      showCurrencyList = true;
      CurrencyList.forEach(function(value,index) {
        var CurrencyName = value.Name + ' (' + value.Code + ')';
        Currencies.push(<Option key={value.Id}>{CurrencyName}</Option>);
      });
    }
    this.setState({ Currencies, CurrencyType, showCurrencyList });
  }
  SelfFiat(SelfFiat) {
    var FromAccountList = [];
    var showFromAccount = false;
    var FromAccountLabel = '';
    var PayeeList = [];
    var showPayee = false;
    var PayeeLabel = '';
    var Payee = SelfFiat.SelfFiatDetail;
    if(Payee.length > 0) {
      showFromAccount = true;
      FromAccountLabel = 'From Wallet';
      showPayee = true;
      PayeeLabel = 'Bank Account';
      Payee.forEach(function(value,index) {
        var PayeeName = value.Data.Nickname + ' - ' + value.DataText.Text;
        PayeeList.push(<Option key={value.Data.Id}>{PayeeName}</Option>);
      });
    }
    FromAccountList = PayeeList;
    this.setState({ FromAccountList, FromAccountLabel, showFromAccount,
      PayeeList, PayeeLabel, showPayee });
  }
  SelfCrypto(Payee) {
    var FromAccountList = [];
    var showFromAccount = false;
    var FromAccountLabel = '';
    var PayeeList = [];
    var showPayee = false;
    var PayeeLabel = '';
    if(Payee.length > 0) {
      showFromAccount = true;
      FromAccountLabel = 'From Wallet';
      showPayee = true;
      PayeeLabel = 'To Wallet';
      Payee.forEach(function(value,index) {
        var PayeeName = value.Nickname + ' - ' + value.Address;
        PayeeList.push(<Option key={value.Id}>{PayeeName}</Option>);
      });
    }
    FromAccountList = PayeeList;
    this.setState({ FromAccountList, FromAccountLabel, showFromAccount,
      PayeeList, PayeeLabel, showPayee });
  }
  PayeeCrypto(Payee) {
    var showPayee = false;
    var PayeeList = [];
    var PayeeLabel = '';
    if(Payee.length > 0) {
      showPayee = true;
      PayeeLabel = 'Payee Name';
      Payee.forEach(function(value,index) {
        var PayeeName = value.Nickname + ' - ' + value.Address;
        PayeeList.push(<Option key={value.Id}>{PayeeName}</Option>);
      });
    }
    this.setState({ PayeeList, PayeeLabel, showPayee });
  }
  listPayee(Payee) {
    switch (this.state.TransferType) {
      case "WALLET":
        switch (this.state.CurrencyType) {
          case "FIAT":
              this.SelfFiat(Payee.SelfFiat);
            break;
          case "CRYPTO":
              this.SelfCrypto(Payee.SelfCrypto);
            break;
          default:
        }
        break;
      case "PAYEE":
        switch (this.state.CurrencyType) {
          case "CRYPTO":
              this.PayeeCrypto(Payee.PayeeCrypto);
            break;
          default:
        }
      break;
      default:
    }
    this.setState({ CurrencyId, showPayee });
  }
  myCurrencies(WalletData) {
    //console.log(WalletData);
    const panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    var mythis = this;
    WalletData.forEach(function(value,index) {
      var closable = true;
      if(value.Wallet.Amount > 0 || value.Wallet.AmountLocked > 0) {
        closable = false;
      }
      activeKey = `${value.Wallet.Id}`;
      var title = mythis.ApiCoinford.getCurrencyCode(value.Wallet.CurrencyId);
      panes.push({ title: title,
        content: <WalletList
        CurrencyId={value.Wallet.CurrencyId}
        WalletListList={value.Addresses}
        callback={mythis.props.callback} />,
        key: activeKey, closable: closable });
    });
    this.setState({ panes, activeKey });
  }
  notify(message) {
    console.log(message);
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
    this.ApiCoinford.CurrencyId = parseInt(activeKey, 10)
  }
  onEdit = (targetKey, action) => {
    this.ApiCoinford.deleteFundTransfer(parseInt(targetKey, 10), this.notify, this.myCurrencies, this.props.callback);
    //this[action](targetKey);
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.CurrencyId = parseInt(values.CurrencyId, 10)
        console.log(values);
        if(values.Active != true && values.Active != false)
          values.Active = false;
        if(values.Primary != true && values.Primary != false)
          values.Primary = false;
        this.ApiCoinford.addFundTransfer(values, this.notify, this.myCurrencies, this.props.callback);
      }
    });
  }
  handleCurrencyChange(value) {
    const CurrencyId = parseInt(value, 10);
    var TransferSearch = [];
    const PayeeList = [];
    const PayeeLabel = '';
    //const showCurrencyList = false;
    const showPayee = false;
    const showAmount = false;
    const showButton = false;

    if(this.state.CurrencyType != '' || this.state.TransferType != '') {
      TransferSearch = {
        CurrencyId: CurrencyId,
        CurrencyType: this.state.CurrencyType,
        TransferType: this.state.TransferType,
      };
      this.ApiCoinford.listPayee(TransferSearch, this.listPayee, this.props.callback);
    }
    this.setState({ CurrencyId, TransferSearch, PayeeList,
      PayeeLabel,
      showPayee, showAmount, showButton });
    //this.setState({ CurrencyId, TransferSearch });
  }
  handleCurrencyBlur() {
    //console.log('blur');
  }
  handleCurrencyFocus() {
    //console.log('focus');
  }
  onChangeTransferType = (e) => {
    const CurrencyId = 0;
    //const CurrencyType = this.state.CurrencyType;
    const TransferType = e.target.value;;
    const TransferSearch = [];
    const Currencies = [];
    const PayeeList = [];
    const PayeeLabel = '';
    const showCurrencyList = false;
    const showPayee = false;
    const showAmount = false;
    const showButton = false;
    //const CurrencyType = this.state.CurrencyType
    //this.initialState(this.state.panes);
    //const TransferType = e.target.value;
    this.setState({ CurrencyId, TransferType, TransferSearch, Currencies,
      PayeeList, PayeeLabel, showCurrencyList,
      showPayee, showAmount, showButton });
    if(this.state.CurrencyType != '') {
      this.Currencies(this.state.CurrencyType);
    }
  }
  onChangeCurrencyType = (e) => {
    const CurrencyId = 0;
    const CurrencyType = e.target.value;
    const TransferSearch = [];
    const PayeeList = [];
    const PayeeLabel = '';
    const showCurrencyList = false;
    const showPayee = false;
    const showAmount = false;
    const showButton = false;
    //const CurrencyId = parseInt(value, 10);
    this.setState({ CurrencyId, CurrencyType, TransferSearch,
      PayeeList, PayeeLabel, showCurrencyList,
      showPayee, showAmount, showButton });
    this.Currencies(CurrencyType);
  }
  handlePayeeChange() {
    var showAmount = true;
    var showButton = true;
    this.setState({ showAmount, showButton });
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
    return (
      <div>
        <Form onSubmit={this.handleAddSubmit}>
          <FormItem
            {...formItemLayout}
            label="Transfer Type"
            required={true}
          >
          {getFieldDecorator('TransferType', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please select transfer type',
            }],
          })(
            <RadioGroup onChange={this.onChangeTransferType}>
              <RadioButton value="SELF">Your Account</RadioButton>
              <RadioButton value="PAYEE">Other Account</RadioButton>
            </RadioGroup>          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Currency Type"
            required={true}
          >
          {getFieldDecorator('CurrencyType', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please select transfer type',
            }],
          })(
            <RadioGroup onChange={this.onChangeCurrencyType}>
              <RadioButton value="FIAT">Bank Transfer</RadioButton>
              <RadioButton value="CRYPTO">Crypto Transfer</RadioButton>
            </RadioGroup>          )}
          </FormItem>
          {this.state.showCurrencyList ? (
          <FormItem
            {...formItemLayout}
            label="Your Currency"
            required={false}
          >
          {getFieldDecorator('CurrencyId', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please select your currency',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select Currency"
              optionFilterProp="children"
              onChange={this.handleCurrencyChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.Currencies}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.showFromAccount ? (
          <FormItem
            {...formItemLayout}
            label={this.state.FromAccountLabel}
            required={false}
          >
          {getFieldDecorator('FromAccount', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please provide a nickname for the address',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.handleFromAccountChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.FromAccountList}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.showPayee ? (
          <FormItem
            {...formItemLayout}
            label={this.state.PayeeLabel}
            required={false}
          >
          {getFieldDecorator('Payee', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please provide a nickname for the address',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.handlePayeeChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.PayeeList}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.showAmount ? (
          <FormItem
            {...formItemLayout}
            label="Amount"
            required={false}
          >
          {getFieldDecorator('Nickname', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please provide a nickname for the address',
            }],
          })(
          <Input placeholder='[Optional] nickname for the address' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          ) : null}
          {this.state.showButton ? (
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Transfer</Button>
          </FormItem>
          ) : null}
        </Form>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    );
  }
}
const Transfer = Form.create()(TransferForm);
module.exports = Transfer;
