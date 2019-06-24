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
    this.RequestOrders = [];
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
  auth(callback) {
    var data = {
      Token: this.Token
    };
    fetch(this.Baseurl + 'user/auth', {
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
  setPostLoginValues(responseJson, callback) {
    this.Token = responseJson.Token;
    this.IsLogin = true;
    this.UiName  = 'Dashboard';
    this.UserName = responseJson.Name;
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
  login(values, callback) {
    var data = {
      Username: values.Username,
      Password: values.Password,
      Token: this.Token
    };
    fetch(this.Baseurl + 'user/login', {
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
    fetch(this.Baseurl + 'order/add', {
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
  capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
         value.ProcessedTypeShow = 'Not Processed';
        } else if(value.ProcessedType === 'PROCESSED') {
         value.ProcessedTypeShow = 'Processed';
        }
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
  userOrderList(callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestOrders: this.getRequestOrders()
    };
    fetch(this.Baseurl + 'order/list', {
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
      console.error();(error);
    });
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
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  countries(RequestCountries, callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestCountries: RequestCountries,
    };
    fetch(this.Baseurl + 'country/list', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.Countries);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  userCountries(RequestCountries, callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestCountries: RequestCountries,
    };
    fetch(this.Baseurl + 'usercountry/list', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.Countries);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  addUserCountry(CountryId, RequestCountries, notify, callback, homeCallback) {
    var data = {
      CountryId: CountryId,
      Token: this.Token,
      RequestCountries: RequestCountries,
    };
    fetch(this.Baseurl + 'usercountry/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.Countries);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        notify(responseJson.ResponseDescription);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  deleteUserCountry(Id, RequestCountries, notify, callback, homeCallback) {
    var data = {
      Id: Id,
      Token: this.Token,
      RequestCountries: RequestCountries,
    };
    fetch(this.Baseurl + 'usercountry/delete', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.Countries);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        notify(responseJson.ResponseDescription);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  fields(RequestField, callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestField: RequestField,
    };
    fetch(this.Baseurl + 'field/list', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.Fields);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  uploadData(data, callback, homeCallback) {
    fetch(this.Baseurl + 'data/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.DataGroup);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  listData(RequestField, callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestField: RequestField,
    };
    fetch(this.Baseurl + 'data/list', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        callback(responseJson.DataGroup);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
  uploadFile(RequestField, callback, homeCallback) {
    var data = {
      Token: this.Token,
      RequestField: RequestField,
    };
    fetch(this.Baseurl + 'file/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.ResponseCode == 200) {
        //callback(responseJson.DataGroup);
      } else if (responseJson.ResponseCode == 403) {
        this.setPreLoginValues(homeCallback);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error();(error);
    });
  }
}
module.exports = ApiCoinford;
