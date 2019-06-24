handleRateChange(Rate) {
  //if(this.state.OrderType == "BUY") {
    /*if(Rate > 0) {
      this.props.showBalanceLink(true);
    } else {
      this.props.showBalanceLink(false);
    }*/
  //}
  //var TotalAmount = 0;
  }

  if(Rate > 0) {
    this.props.showBalanceLink(true);
  } else {
    this.props.showBalanceLink(false);
  }

//Exchange.js
this.currencyBalanceLink = this.currencyBalanceLink.bind(this);
this.rateCurrencyBalanceLink = this.rateCurrencyBalanceLink.bind(this);

  showCurrencyBalanceLink: true,
  showRateCurrencyBalanceLink: true,

  showBalanceLink={this.currencyBalanceLink}
  showBalanceLink={this.rateCurrencyBalanceLink}

  &nbsp;
  {this.state.showRateCurrencyBalanceLink ? (
    <a onClick={this.handleRateCurrencyBalance}>{this.state.RateCurrencyBalance}</a>
  ) : this.state.RateCurrencyBalance }
  &nbsp;

  &nbsp;
  {this.state.showCurrencyBalanceLink ? (
    <a onClick={this.handleCurrencyBalance}>{this.state.CurrencyBalance}</a>
  ) : this.state.CurrencyBalance }
  &nbsp;

  currencyBalanceLink(status) {
    var showCurrencyBalanceLink = status;
    this.setState({ showCurrencyBalanceLink });
  }
  rateCurrencyBalanceLink(status) {
    var showRateCurrencyBalanceLink = status;
    this.setState({ showRateCurrencyBalanceLink });
  }


  <Modal
    title={ordertypename}
    visible={this.state.visibleConfirm}
    onOk={this.handleOkConfirm}
    onCancel={this.handleCancelConfirm}
    okText="Place Order"
    cancelText="Cancel"
  >
    <p>{rateText}</p>
    <p>{amountText}</p>
    <p>{totalAmountText}</p>
  </Modal>

   //Total: {this.state.TotalAmount} {this.state.RateCurrency.Code}
