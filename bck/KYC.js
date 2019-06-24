import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import File from './File';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
let uuid = 0;

class KYCForm extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.state = {
      fieldNames: [],
      fieldDescription: [],
      fieldHasFile: [],
    }
  }
  componentDidMount() {
    this.fieldList();
  }
  fieldList() {
    if(this.props.Eligible == 'YES') {
      //console.log(this.props.Eligible+this.props.CountryId);
    } else {
      var RequestField = {
        CountryId: this.props.CountryId,
        Type: "",
      };
      this.ApiCoinford.fields(RequestField, this.updateUi, this.props.callback);
    }
  }
  updateUi(Fields) {
    const { form } = this.props;
    var keys;
    var nextKeys = [];
    var i = 0;
    var fieldNames = [];
    var fieldDescription = [];
    var fieldHasFile = [];
    console.log(Fields);
    Fields.ADDRESS.forEach(function(value,index) {
      keys = form.getFieldValue('keys');
      nextKeys = keys.concat(value.Field.Id);
      form.setFieldsValue({
        keys: nextKeys,
      });
      fieldNames[i] = value.Field.Name;
      fieldDescription[i] = value.Field.Description;
      fieldHasFile[i] = value.Field.HasFile;
      i++;
    });
    Fields.KYC.forEach(function(value,index) {
      keys = form.getFieldValue('keys');
      nextKeys = keys.concat(value.Field.Id);
      form.setFieldsValue({
        keys: nextKeys,
      });
      fieldNames[i] = value.Field.Name;
      fieldDescription[i] = value.Field.Description;
      fieldHasFile[i] = value.Field.HasFile;
      i++;
    });
    Fields.BANK.forEach(function(value,index) {
      keys = form.getFieldValue('keys');
      nextKeys = keys.concat(value.Field.Id);
      form.setFieldsValue({
        keys: nextKeys,
      });
      fieldNames[i] = value.Field.Name;
      fieldDescription[i] = value.Field.Description;
      fieldHasFile[i] = value.Field.HasFile;
      i++;
    });
    this.setState({ fieldNames });
    this.setState({ fieldDescription });
    this.setState({ fieldHasFile });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const { fieldNames } = this.state;
    const { fieldDescription } = this.state;
    const { fieldHasFile } = this.state;
    const formItems = keys.map((k, index) => {
      var label = fieldNames[index];
      var message = fieldDescription[index];
      return (
        <FormItem
          {...formItemLayout}
          label={label}
          required={false}
          key={k}
        >
          {getFieldDecorator(`${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: {message},
            }],
          })(
            <div>
              <Input placeholder={message} style={{ width: '60%', marginRight: 8 }} />
              {fieldHasFile[index] ? (<File />) : null}
            </div>
          )}
        </FormItem>
      );
    });
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          {keys.length > 1 ? (
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          ) : null}
        </Form>
      </div>
    );
  }
}
const KYC = Form.create()(KYCForm);
module.exports = KYC;
