    this.RequestOrders = [];
    
formatOrderList(OrderList, callback) {
  var AllCurrencies = this.AllCurrencies;
  OrderList.forEach(function(value,index) {
    AllCurrencies.forEach(function(value1,index1) {
      if(value.CurrencyId == value1.Id) {
       value.CurrencyCode = value1.Code;
      }
      if(value.RateCurrencyId == value1.Id) {
       value.RateCurrencyCode = value1.Code;
      }
      if(value.ProcessedType === 'NOT_PROCESSED') {
       value.ProcessedTypeShow = 'No';
      } else if(value.ProcessedType === 'PROCESSED') {
       value.ProcessedTypeShow = 'Yes';
      }
        value.CurrencyPair = value.CurrencyCode + ' / ' + value.RateCurrencyCode;
      var OrderType = value.OrderType.toLowerCase();
      value.OrderTypeShow = OrderType.charAt(0).toUpperCase() + OrderType.slice(1);
    });
    OrderList[index] = value;
  });
  callback(OrderList);
}
getRequestOrders() {
  var data = {
    AllUser: this.RequestOrders.AllUser,
    ExcludeMine: this.RequestOrders.ExcludeMine,
    OrderType: this.RequestOrders.OrderType,
    IsProcessed: this.RequestOrders.IsProcessed
  }
  return data;
}
commonOrder(data, url, callback, homeCallback) {
  data['Token'] = this.Token;
  fetch(this.Baseurl + url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.ResponseCode == 200) {
      this.formatOrderList(responseJson.Orders, callback);
    } else if (responseJson.ResponseCode == 403) {
      this.setPreLoginValues(homeCallback);
    } else {
      callback([]);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
order(values, callback, homeCallback) {
  this.RequestOrders.AllUser = "NO";
  this.RequestOrders.ExcludeMine = "NO";
  this.RequestOrders.OrderType = this.getOrderType();
  this.RequestOrders.IsProcessed = "";
  var data = {
    Amount: values.Amount,
    CurrencyId: values.CurrencyId,
    OrderType: values.OrderType,
    Rate: values.Rate,
    RateCurrencyId: values.RateCurrencyId,
    Token: this.Token,
    RequestOrders: this.getRequestOrders()
  };
  this.commonOrder(data, 'order/add', callback, homeCallback);
}
userOrderList(callback, homeCallback) {
  var data = {
    RequestOrders: this.getRequestOrders()
  };
  this.commonOrder(data, 'order/list', callback, homeCallback);
}
userOrderList(callback, homeCallback) {
  var data = {
    RequestOrders: this.getRequestOrders()
  };
  this.commonOrder(data, 'order/list', 'POST', callback, homeCallback);
}
getRequestOrders() {
  var data = {
    AllUser: this.RequestOrders.AllUser,
    ExcludeMine: this.RequestOrders.ExcludeMine,
    OrderType: this.RequestOrders.OrderType,
    IsProcessed: this.RequestOrders.IsProcessed
  }
  return data;
}
