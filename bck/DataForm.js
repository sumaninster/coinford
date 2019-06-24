import React from 'react';
import { Form, Input, Icon, Button, Select } from 'antd';
import File from './File';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const Option = Select.Option;

class DataForm extends React.Component {
  constructor(props) {
    super(props)
    this.displayForm = this.displayForm.bind(this);
    this.displayData = this.displayData.bind(this);
    this.fieldList = this.fieldList.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.state = {
      Fields: []
    }
  }
  componentDidMount() {
    this.fieldList();
  }
  fieldList() {
    if(this.props.Eligible == 'YES') {
      //this.ApiCoinford.listData(this.props.FieldType, this.displayData, this.props.callback);
    } else {
      var RequestField = {
        CountryId: this.props.CountryId,
        FieldType: this.props.FieldType,
      };
      //this.ApiCoinford.listData(this.props.FieldType, this.displayData, this.props.callback);
      this.ApiCoinford.fields(RequestField, this.displayForm, this.props.callback);
    }
  }
  displayData(data) {
    console.log(data);
  }
  displayForm(data) {
    //const { form } = this.props;
    //var keys;
    //var nextKeys = [];
    var Fields = data.Fields;
    //this.setState({ Fields });
    Fields.forEach(function(value,index) {
      /*keys = form.getFieldValue('keys');
      nextKeys = keys.concat(value.Field.Id);
      form.setFieldsValue({
        keys: nextKeys,
      });*/

      var CategoryOptions = [];
      if(value.Field.HasCategory) {
        var Category = value.Category;
        Category.forEach(function(value1,index1) {
          CategoryOptions.push(<Option key={value1.Id}>{value1.Name}</Option>);
        });
      }
      value.CategoryOptions = CategoryOptions
      Fields[index] = value;
    });
    this.setState({ Fields });
  }
  FormatData(values) {
    var DataTextArray = [];
    var DataCategoryArray = [];
    var DataFileArray = [];
    var dt = 0, dc = 0, df = 0;
    const { Fields } = this.state;

    Fields.forEach(function(value,index) {
      if(value.Field.HasInputText) {
        var DataText = {
          FieldId: value.Field.Id,
          InputText: values['Text'+value.Field.Id],
        }
        DataTextArray[dt++] = DataText;
      } else if(value.Field.HasCategory) {
        var FieldCategoryId = parseInt(values['Category'+value.Field.Id], 10)
        var DataCategory = {
          FieldId: value.Field.Id,
          FieldCategoryId: FieldCategoryId,
        }
        DataCategoryArray[dc++] = DataCategory;
      } else if(value.Field.HasFile){

      }
    });
    var data = {
      Active: true,
      Primary: true,
      CountryId: this.props.CountryId,
      FieldType: this.props.FieldType,
      Nickname: "",
      Token: this.ApiCoinford.Token,
      DataCategory: DataCategoryArray,
      DataFile: DataFileArray,
      DataText: DataTextArray,
    }
    return data;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var data = [];
        data = this.FormatData(values);
        console.log(data);
        //this.ApiCoinford.uploadData(data, this.updateUi, this.props.callback);
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
    //getFieldDecorator('keys', { initialValue: [] });
    //const keys = getFieldValue('keys');
    const { Fields } = this.state;
    const formItems = Fields.map((value, index) => {
      var label = Fields[index].Field.Name;
      var message = Fields[index].Field.Description;
      var category = Fields[index].CategoryOptions;
      return (
        <div>
          {Fields[index].Field.HasCategory ? (
            <FormItem
              {...formItemLayout}
              label={label}
              required={false}
              //key={`Category${value.Field.Id}`}
            >
            {getFieldDecorator(`Category${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder={message}
              optionFilterProp="children"
              onChange={this.handleCountryChange}
              onFocus={this.handleCountryFocus}
              onBlur={this.handleCountryBlur}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {category}
            </Select>
          )}
          </FormItem>
          ) : null }
          {Fields[index].Field.HasInputText ? (
            <FormItem
              {...formItemLayout}
              label={label}
              required={false}
              //key={`Text${value.Field.Id}`}
            >
            {getFieldDecorator(`Text${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <Input placeholder={message} style={{ width: '60%', marginRight: 8 }} />
            )}
            </FormItem>
          ) : null }
          {Fields[index].Field.HasFile ? (
            <FormItem
              {...formItemLayout}
              label={label+' (Upload)'}
              required={false}
              //key={`File${value.Field.Id}`}
            >
            {getFieldDecorator(`File${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <File />
          )}
          </FormItem>
          ) : null }
        </div>
      );
    });
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          {Fields.length > 0 ? (
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          ) : null}
        </Form>
      </div>
    );
  }
}

module.exports = DataForm;
