{new Date().toLocaleTimeString()}

LoadOrderList(){
  this.api_coinford.UserOrderList(this.updateui, this.props.homecallback);
}

<OrderConfirm homecallback={this.props.callback} callback={this.submitOrder} ref={(OrderConfirm) => { this.OrderConfirm = OrderConfirm; }} />

//values.CurrencyId = parseInt(values.CurrencyId, 10);
//values.RateCurrencyId = parseInt(values.RateCurrencyId, 10);
//values.OrderType = this.api_coinford.GetOrderType();

SetOrderType(OrderType) {
  var ordertypename = this.api_coinford.CapitalizeFirstLetter(OrderType);
  this.state = {
    OrderType: OrderType,
    ordertypename: ordertypename,
  };
}
const panes = this.state.panes;
const activeKey = `newTab${this.newTabIndex++}`;
const CountryName = this.state.CountryName;
panes.push({ title: CountryName, content: <AddressId />, key: activeKey });
this.setState({ panes, activeKey });

//var CountryName;
Countries.forEach(function(value,index) {
  //CountryName = value.Name;
  activeKey = `${newTabIndex++}`;
  panes.push({ title: value.Name, content: <AddressId />, key: activeKey });
});

<Option value="United States">United States</Option>
<Option value="Canada">Canada</Option>
<Option value="India">India</Option>

https://github.com/ant-design/ant-design/blob/master/components/form/demo/dynamic-form-item.md
