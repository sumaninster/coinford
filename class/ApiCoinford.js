let instance = null;
class ApiCoinford {
  constructor() {
    //this.Baseurl = 'http://192.168.0.203:8080/v1/';
    this.Baseurl = '//localhost:8080/v1/';
    this.Token   = '';
    this.IsLogin = false;
    this.UiName  = 'Login';
    this.UserName = '';
    this.OrderType = '';
    this.AllCurrencies = [];
    this.FiatCurrencies = [];
    this.CryptoCurrencies = [];
    this.CurrencyId = 0;
    this.ProcessedRate = 0;
    this.RateCurrencyId = 0;

    this.setCurrencyPair = this.setCurrencyPair.bind(this);
    if(!instance){
      instance = this;
    }
    return instance;
  }
  setUiName(UiName) {
    this.UiName = UiName;
  }
  getUiName() {
    return this.UiName;
  }
  setOrderType(OrderType) {
    this.OrderType = OrderType;
  }
  getOrderType() {
    return this.OrderType;
  }
  isUserLogin() {
    return this.IsLogin;
  }
  setPostLoginValues(responseJson, callback) {
    this.Token = responseJson.Token;
    this.IsLogin = true;
    this.UiName  = 'Dashboard';
    this.UserName = responseJson.Name;
    this.myCurrencyPair(callback);
    this.currencyList(callback);
    console.log(this.Token);
    callback();
  }
  setPreLoginValues(callback) {
    this.getToken();
    this.IsLogin = false;
    this.UiName  = 'Login';
    callback();
  }
  getToken() {
    fetch(this.Baseurl + 'user/token', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.Token = responseJson.Token;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  commonLogin(data, url, callback) {
    data['Token'] = this.Token;
    fetch(this.Baseurl + url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.setPostLoginValues(responseJson, callback);
      } else {
        this.setPreLoginValues(callback);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  auth(callback) {
    var data = {};
    this.commonLogin(data, 'user/auth', callback);
  }
  login(values, callback) {
    var data = {
      Username: values.Username,
      Password: values.Password,
    };
    this.commonLogin(data, 'user/login', callback);
  }
  loginDefault(values, callback) {
    fetch(this.Baseurl + 'user/token', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.Token = responseJson.Token;
      this.login(values, callback)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  logout(callback) {
    var data = {
      Token: this.Token
    };
    fetch(this.Baseurl + 'user/logout', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.setPreLoginValues(callback);
      } else {
        this.setPreLoginValues(callback);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  isUniqueUsername(username, callback) {
    var data = {
      Username: username,
      Token: this.Token
    };
    fetch(this.Baseurl + 'user/isuniqueusername', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback();
      } else {
        callback(responseJson.ResponseDescription);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  register(values, callback) {
    var data = {
      Email: values.Email,
      Name: values.Name,
      Username: values.Username,
      Password: values.Password,
      Token: this.Token
    };
    fetch(this.Baseurl + 'user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.setPostLoginValues(responseJson, callback);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(callback);
      } else {
        this.getToken();
        this.IsLogin = false;
        this.UiName  = 'Register'
        callback();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  formatOrderList(OrderList, callback) {
    var AllCurrencies = this.AllCurrencies;
    if(OrderList != null) {
      OrderList.forEach(function(value,index) {
        AllCurrencies.forEach(function(value1,index1) {
          if(value.CurrencyId == value1.Id) {
           value.CurrencyCode = value1.Code;
          }
          if(value.RateCurrencyId == value1.Id) {
           value.RateCurrencyCode = value1.Code;
          }
          /*if(value.ProcessedType === 'NOT_PROCESSED') {
           value.ProcessedTypeShow = 'No';
          } else if(value.ProcessedType === 'PROCESSED') {
           value.ProcessedTypeShow = 'Yes';
         }*/
            value.CurrencyPair = value.CurrencyCode + ' / ' + value.RateCurrencyCode;
          //var OrderType = value.OrderType.toLowerCase();
          //value.OrderTypeShow = OrderType.charAt(0).toUpperCase() + OrderType.slice(1);
        });
        OrderList[index] = value;
      });
    }
    callback(OrderList);
  }
  formatMyOrderList(OrderList, callback) {
    var AllCurrencies = this.AllCurrencies;
    var MyOrderList = [];
    if(OrderList != null) {
      OrderList.forEach(function(value,index) {
        AllCurrencies.forEach(function(value1,index1) {
          if(value.Order.CurrencyId == value1.Id) {
           value.Order.CurrencyCode = value1.Code;
          }
          if(value.Order.RateCurrencyId == value1.Id) {
           value.Order.RateCurrencyCode = value1.Code;
          }
          value.Order.OrderType = value.OrderType
        });
        MyOrderList[index] = value.Order;
      });
    }
    callback(MyOrderList);
  }
  commonCall(data, url, method, field,
    isNotify, notify,
    isCallback, callback,
    homeCallback) {
    data['Token'] = this.Token;
    fetch(this.Baseurl + url, {
      method: method,
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        //console.log(responseJson);
        if(isCallback){
          callback(responseJson[field]);
        }
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        if(isNotify) {
          notify(responseJson.ResponseDescription);
        } else if(callback){
          callback([]);
        }
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  commonOrder(data, url, method, callback, homeCallback, myWallet) {
    fetch(this.Baseurl + url, {
      method: method,
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        if (callback != null) {
          this.formatOrderList(responseJson.Orders, callback);
        }
        if (myWallet != null) {
          myWallet(responseJson.CurrencyWallets, responseJson.RateCurrencyWallets, responseJson.OrderWallet);
        }
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
  limitBuyOrder(values, CurrencyWalletId, RateCurrencyWalletId, callback, homeCallback, myWallet) {
    var data = {
      Amount: values.Amount,
      Rate: values.Rate,
      CurrencyId: values.CurrencyId,
      RateCurrencyId: values.RateCurrencyId,
      CurrencyWalletId: CurrencyWalletId,
      RateCurrencyWalletId: RateCurrencyWalletId,
      Token: this.Token,
    };
    this.commonOrder(data, 'order/limitbuy', 'POST', callback, homeCallback, myWallet);
  }
  limitSellOrder(values, CurrencyWalletId, RateCurrencyWalletId, callback, homeCallback, myWallet) {
    var data = {
      Amount: values.Amount,
      Rate: values.Rate,
      CurrencyId: values.CurrencyId,
      RateCurrencyId: values.RateCurrencyId,
      CurrencyWalletId: CurrencyWalletId,
      RateCurrencyWalletId: RateCurrencyWalletId,
      Token: this.Token,
    };
    this.commonOrder(data, 'order/limitsell', 'POST', callback, homeCallback, myWallet);
  }
  deleteBuyOrder(OrderId, callback, homeCallback, myWallet) {
    var data = {
      OrderId: OrderId,
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      Token: this.Token,
    };
    this.commonOrder(data, 'order/deletebuy', 'DELETE', callback, homeCallback, myWallet);
  }
  deleteSellOrder(OrderId, callback, homeCallback, myWallet) {
    var data = {
      OrderId: OrderId,
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      Token: this.Token,
    };
    this.commonOrder(data, 'order/deletesell', 'DELETE', callback, homeCallback, myWallet);
  }
  listExchange(orderBuys, orderSells, orders,
    myOrderBuys, myOrderSells, myOrders,
    myWallet, homeCallback) {
    var data = {
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      Token: this.Token,
    };
    fetch(this.Baseurl + 'order/alllist', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.formatOrderList(responseJson.OrderBuys, orderBuys);
        this.formatOrderList(responseJson.OrderSells, orderSells);
        this.formatOrderList(responseJson.Orders, orders);
        this.formatOrderList(responseJson.MyOrderBuys, myOrderBuys);
        this.formatOrderList(responseJson.MyOrderSells, myOrderSells);
        this.formatMyOrderList(responseJson.MyOrders, myOrders);
        myWallet(responseJson.CurrencyWallets, responseJson.RateCurrencyWallets, responseJson.OrderWallet);
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
  listTradeHistory(Duration, trades, tradeGraph, homeCallback) {
    var data = {
      Duration: Duration,
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      Token: this.Token,
    };
    fetch(this.Baseurl + 'trade/history', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        trades(responseJson.Low, responseJson.High, responseJson.Last);
        tradeGraph(responseJson.Orders)
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
  updateMyCurrencyPair(homeCallback) {
    var data = {
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      Token: this.Token,
    };
    this.commonCall(data, 'order/updatemycurrencypair', 'POST',
    '', false, null, false, null, homeCallback);
  }
  updateMyOrderWallet(CurrencyWalletId, RateCurrencyWalletId, homeCallback, myWallet) {
    var data = {
      CurrencyId: this.CurrencyId,
      RateCurrencyId: this.RateCurrencyId,
      CurrencyWalletId: CurrencyWalletId,
      RateCurrencyWalletId: RateCurrencyWalletId,
      Token: this.Token,
    };
    this.commonOrder(data, 'order/updatemyorderwallet', 'POST', null, homeCallback, myWallet);
  }
  myCurrencyPair(homeCallback) {
    var data = {
      Token: this.Token,
    };
    this.commonCall(data, 'order/mycurrencypair', 'POST',
    'DefaultCurrencyPair', false, null, true, this.setCurrencyPair, homeCallback);
  }
  setCurrencyPair(DefaultCurrencyPair) {
    this.CurrencyId = DefaultCurrencyPair.CurrencyId;
    this.RateCurrencyId = DefaultCurrencyPair.RateCurrencyId;
  }
  getCurrencyName(CurrencyId) {
    var AllCurrencies = this.AllCurrencies;
    var CurrencyName = "";
    AllCurrencies.forEach(function(value,index) {
      if (CurrencyId == value.Id) {
        CurrencyName = value.Name;
      }
    });
    return CurrencyName;
  }
  getCurrencyCode(CurrencyId) {
    var AllCurrencies = this.AllCurrencies;
    var CurrencyCode = "";
    AllCurrencies.forEach(function(value,index) {
      if (CurrencyId == value.Id) {
        CurrencyCode = value.Code;
      }
    });
    return CurrencyCode;
  }
  getCurrencyObject(CurrencyId) {
    var AllCurrencies = this.AllCurrencies;
    var CurrencyObject = [];
    AllCurrencies.forEach(function(value,index) {
      if (CurrencyId == value.Id) {
        CurrencyObject = value;
      }
    });
    return CurrencyObject;
  }
  currencyOptions(SelectedCurrency) {
    return this.commonCurrencyOptions(this.CryptoCurrencies, SelectedCurrency);
  }
  rateCurrencyOptions(SelectedCurrency) {
    return this.commonCurrencyOptions(this.AllCurrencies, SelectedCurrency);
  }
  commonCurrencyOptions(Currencies, SelectedCurrency) {
    var CurrencyOptions = [];
    Currencies.forEach(function(value,index) {
      var Currency = [];
      if (value.Id != SelectedCurrency) {
        Currency.label = value.Code;
        Currency.value = '' + value.Id;
        CurrencyOptions[index] = Currency;
      }
    });
    return CurrencyOptions;
  }
  currencyList(homeCallback) {
    var data = {
      Token: this.Token
    };
    fetch(this.Baseurl + 'currency/list', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        this.AllCurrencies = responseJson.AllCurrencies;
        this.FiatCurrencies = responseJson.FiatCurrencies;
        this.CryptoCurrencies = responseJson.CryptoCurrencies;
        homeCallback();
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  commonList(data, url, method, field, isNotify, notify, callback, homeCallback) {
    data['Token'] = this.Token;
    fetch(this.Baseurl + url, {
      method: method,
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson[field]);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        if(isNotify) {
          notify(responseJson.ResponseDescription);
        } else {
          callback([]);
        }
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  countries(RequestCountries, callback, homeCallback) {
    var data = {
      RequestCountries: RequestCountries,
    };
    this.commonList(data, 'country/list', 'POST',
    'Countries', false, null, callback, homeCallback);
  }
  userCountries(RequestCountries, callback, homeCallback) {
    var data = {
      RequestCountries: RequestCountries,
    };
    this.commonList(data, 'usercountry/list', 'POST',
    'Countries', false, null, callback, homeCallback);
  }
  addUserCountry(CountryId, RequestCountries, notify, callback, homeCallback) {
    var data = {
      CountryId: CountryId,
      RequestCountries: RequestCountries,
    };
    this.commonList(data, 'usercountry/add', 'POST',
    'Countries', true, notify, callback, homeCallback);
  }
  deleteUserCountry(Id, RequestCountries, notify, callback, homeCallback) {
    var data = {
      Id: Id,
      RequestCountries: RequestCountries,
    };
    this.commonList(data, 'usercountry/delete', 'DELETE',
    'Countries', true, notify, callback, homeCallback);
  }
  fields(RequestField, callback, homeCallback) {
    var data = {
      RequestField: RequestField,
    };
    this.commonList(data, 'field/list', 'POST',
    'Fields', false, null, callback, homeCallback);
  }
  uploadData(data, callback, homeCallback) {
    this.commonList(data, 'data/add', 'POST',
    'DataGroup', false, null, callback, homeCallback);
  }
  listData(RequestField, callback, homeCallback) {
    var data = {
      RequestField: RequestField,
    };
    this.commonList(data, 'data/list', 'POST',
    'DataGroup', false, null, callback, homeCallback);
  }
  uploadFile(RequestField, callback, homeCallback) {
    var data = {
      RequestField: RequestField,
    };
    this.commonList(data, 'file/upload', 'POST',
    '', false, null, callback, homeCallback);
  }
  listWallet(callback, homeCallback) {
    var data = {};
    this.commonList(data, 'wallet/list', 'POST',
    'WalletMasterData', false, null, callback, homeCallback);
  }
  addWallet(values, notify, callback, homeCallback) {
    var data = {
      CurrencyId: values.CurrencyId,
      Nickname: values.Nickname,
      primary: values.Primary,
    };
    this.commonList(data, 'wallet/add', 'POST',
    'WalletMasterData', true, notify, callback, homeCallback);
  }
  deleteWallet(WalletMasterId, notify, callback, homeCallback) {
    var data = {
      Id: WalletMasterId,
    };
    this.commonList(data, 'wallet/delete', 'DELETE',
    'WalletMasterData', true, notify, callback, homeCallback);
  }
  listPayee(callback, homeCallback) {
    var data = {};
    this.commonList(data, 'payee/list', 'POST',
    'PayeeMasterData', false, null, callback, homeCallback);
  }
  addPayee(values, notify, callback, homeCallback) {
    var data = {
      CurrencyId: values.CurrencyId,
      Name: values.Name,
      Email: values.Email,
      Address: values.Address,
      Nickname: values.Nickname,
    };
    this.commonList(data, 'payee/add', 'POST',
    'PayeeMasterData', true, notify, callback, homeCallback);
  }
  deletePayee(PayeeMasterId, notify, callback, homeCallback) {
    var data = {
      Id: PayeeMasterId,
    };
    this.commonList(data, 'payee/delete', 'DELETE',
    'PayeeMasterData', true, notify, callback, homeCallback);
  }
  listPayeeAll(TransferSearch, callback, homeCallback) {
    var data = {TransferSearch: TransferSearch};
    this.commonList(data, 'payee/listall', 'POST',
    'Payee', false, null, callback, homeCallback);
  }
  listTransfer(callback, homeCallback) {
    var data = {};
    this.commonList(data, 'transfer/list', 'POST',
    'TransferData', false, null, callback, homeCallback);
  }
  addTransfer(values, notify, callback, homeCallback) {
    var data = {
      FromWalletId: values.FromWalletId,
      ToWalletId: values.ToWalletId,
      ToPayeeId: values.ToPayeeId,
      ToDataId: values.ToDataId,
      Amount: values.Amount,
      TransferSearch: values.TransferSearch,
    };
    this.commonList(data, 'transfer/add', 'POST',
    'TransferData', true, notify, callback, homeCallback);
  }
  deleteTransfer(TransferId, notify, callback, homeCallback) {
    var data = {
      TransferId: TransferId,
    };
    this.commonList(data, 'transfer/delete', 'DELETE',
    'TransferData', true, notify, callback, homeCallback);
  }
}
module.exports = ApiCoinford;
