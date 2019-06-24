handleCryptoChange = (e) => {
  const CurrencyId = parseInt(e.target.value, 10);
  if(CurrencyId != 0) {
    var cname = this.ApiCoinford.getCurrencyObject(CurrencyId);
    var currencyname = "Amount (" + cname.Name + "/" + cname.Code + ")";
    this.setState({ currencyname });
  }
  this.setState({ CurrencyId });
}
handleRateCurrencyChange = (e) => {
  const RateCurrencyId = parseInt(e.target.value, 10);
  if(RateCurrencyId != 0) {
    var rcname = this.ApiCoinford.getCurrencyObject(RateCurrencyId);
    var ratecurrencyname = "Rate (" + rcname.Name + "/" + rcname.Code + ")";
    this.setState({ ratecurrencyname });
  }
  this.setState({ RateCurrencyId });
}

<a onClick={this.handleEdit}>Edit</a>
<span className="ant-divider" />

initializeFields() {
  this.props.form.setFields({
    CurrencyId: {
      value: ''+this.ApiCoinford.CurrencyId,
    },
    RateCurrencyId: {
      value: ''+this.ApiCoinford.RateCurrencyId,
    },
    Amount: {
      value: '',
    },
    Rate: {
      value: '',
    },
  });
}
