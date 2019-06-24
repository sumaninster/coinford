import React from 'react';
import { Tabs, Form, Button, Select, Tooltip, Icon } from 'antd';
import ProfileDetail from './ProfileDetail';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class AccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    this.notify = this.notify.bind(this);
    this.countries = this.countries.bind(this);
    this.myCountries = this.myCountries.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    const panes = this.initialPanes();
    this.state = {
      panes,
      CurrencyId: 0,
      Countries: [],
    };
  }
  initialPanes() {
    const panes = [
      { title: 'Profile',
      content: <ProfileDetail subMenu='Profile'
      callback={this.props.callback} />,
      key: 'Profile', closable: false },
    ];
    return panes;
  }
  componentDidMount() {
    var RequestCountries = {
      OnlyMine: "NO",
      Eligible: "",
    };
    this.ApiCoinford.countries(RequestCountries, this.countries, this.props.callback);
    var RequestCountries = {
      OnlyMine: "YES",
      Eligible: "",
    };
    this.ApiCoinford.userCountries(RequestCountries, this.myCountries, this.props.callback);
  }
  countries(CurrencyList) {
    var Countries = [];
    CurrencyList.forEach(function(value,index) {
      Countries.push(<Option key={value.Id}>{value.Name}</Option>);
    });
    this.setState({ Countries });
  }
  myCountries(Countries) {
    const panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    Countries.forEach(function(value,index) {
      var closable = true;
      if(value.UserCurrency.Eligible == 'YES') {
        closable = false;
      }
      activeKey = `${value.UserCurrency.Id}`;
      panes.push({ title: value.Currency.Name,
        content: <ProfileDetail subMenu='KYC'
        Eligible={value.UserCurrency.Eligible}
        CurrencyId={value.Currency.Id}
        callback={callback} />,
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
    var RequestCountries = {
      OnlyMine: "YES",
      Eligible: "",
    };
    this.ApiCoinford.deleteUserCurrency(parseInt(targetKey, 10), RequestCountries, this.notify, this.myCountries, this.props.callback);
    //this[action](targetKey);
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var RequestCountries = {
          OnlyMine: "YES"
        };
        this.ApiCoinford.addUserCurrency(this.state.CurrencyId, RequestCountries, this.notify, this.myCountries, this.props.callback);
      }
    });
  }
  handleCurrencyChange(value) {
    const CurrencyId = parseInt(value, 10);
    this.setState({ CurrencyId });
  }
  handleCurrencyBlur() {
    //console.log('blur');
  }
  handleCurrencyFocus() {
    //console.log('focus');
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
            label={(
              <span>
                Your Currency&nbsp;
                <Tooltip title="Select currency you want to trade and invest">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('CurrencyId', {
              rules: [{ required: true, message: 'Please select a Currency!', whitespace: true }],
            })(
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.handleCurrencyChange}
                onFocus={this.handleCurrencyFocus}
                onBlur={this.handleCurrencyBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              {this.state.Countries}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Add Currency</Button>
          </FormItem>
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
const Account = Form.create()(AccountForm);
module.exports = Account;
