
this.handleNewWalletCancel = this.handleNewWalletCancel.bind(this);
this.handleNewPayeeCancel = this.handleNewPayeeCancel.bind(this);

NewWalletVisible: false,
NewPayeeVisible: false,

addPayee() {
  const TransferType = this.state.TransferType;
  var NewWalletVisible = false;
  var NewPayeeVisible = false;

  if(TransferType == "SELF") {
    NewWalletVisible = true;
  } else if(TransferType == "PAYEE") {
    NewPayeeVisible = true;
  }
  this.setState({ NewWalletVisible, NewPayeeVisible });
}

handleNewWalletOk() {

}
handleNewWalletCancel() {
  var NewWalletVisible = false;
  var NewPayeeVisible = false;
  this.setState({ NewWalletVisible, NewPayeeVisible });
}
handleNewPayeeOk() {

}
handleNewPayeeCancel() {
  var NewWalletVisible = false;
  var NewPayeeVisible = false;
  this.setState({ NewWalletVisible, NewPayeeVisible });
}

<Modal
  title={this.state.PayeeButtonLabel}
  visible={this.state.NewWalletVisible}
  onOk={this.handleNewWalletOk}
  onCancel={this.handleNewWalletCancel}
  okText={this.state.PayeeButtonLabel}
  cancelText="Cancel"
>
<WalletAdd CurrencyId={this.state.CurrencyId}/>
</Modal>



<Modal
  title={this.state.PayeeButtonLabel}
  visible={this.state.NewPayeeVisible}
  onOk={this.handleNewPayeeOk}
  onCancel={this.handleNewPayeeCancel}
  okText={this.state.PayeeButtonLabel}
  cancelText="Cancel"
>
  <p>Currency: {this.state.CurrencyName}</p>
  <p>xx</p>
  <p>xx</p>
</Modal>

selectPayeeList(TransferType, CurrencyType, FromTo, Id) {
  if(TransferType == "SELF" && CurrencyType == "FIAT" && (FromTo == "FROM" || FromTo == "TO")) {
    return this.WalletFiat(FromTo, Id);
  } else if(TransferType == "SELF" && CurrencyType == "CRYPTO" && (FromTo == "FROM" || FromTo == "TO")) {
    return this.WalletCrypto(FromTo, Id);
  } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "FROM") {
    return this.WalletCrypto(FromTo, Id);
  } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "TO") {
    return this.PayeeCrypto(FromTo, Id);
  }
}
WalletCrypto(FromTo, Id) {
  var WalletCrypto = this.state.Payee.WalletCrypto;
  var WalletCryptoList = [];
  var CurrencyCode = this.ApiCoinford.getCurrencyCode(this.state.CurrencyId);
  if( WalletCrypto != null) {
    if(WalletCrypto.length > 0) {
      WalletCrypto.forEach(function(value,index) {
        var Amount = value.Wallet.Amount - value.Wallet.AmountLocked;
        var WalletCryptoName = '(' + Amount + ' ' + CurrencyCode + ') ' + value.Wallet.Nickname + ' - ' + value.Crypto.Address;
        if(Id != value.Wallet.Id) {
          if(FromTo == "FROM") {
            if(Amount > 0) {
              WalletCryptoList.push(<Option key={value.Wallet.Id}>{WalletCryptoName}</Option>);
            }
          } else {
            WalletCryptoList.push(<Option key={value.Wallet.Id}>{WalletCryptoName}</Option>);
          }
        }
      });
    }
  }
  return WalletCryptoList;
}
WalletFiat(FromTo, Id) {
  var WalletFiat = this.state.Payee.WalletFiat;
  var WalletFiatList = [];
  var CurrencyCode = this.ApiCoinford.getCurrencyCode(this.state.CurrencyId);
  if( WalletFiat != null) {
    if(WalletFiat.length > 0) {
      WalletFiat.forEach(function(value,index) {
        var Amount = value.Wallet.Amount - value.Wallet.AmountLocked;
        var WalletFiatName = '(' + Amount + ' ' + CurrencyCode + ') ' + value.Wallet.Nickname + ' - ' + value.DataText.Text;
        if(Id != value.Wallet.Id) {
          if(FromTo == "FROM") {
            if(Amount > 0) {
              WalletFiatList.push(<Option key={value.Wallet.Id}>{WalletFiatName}</Option>);
            }
          } else {
            WalletFiatList.push(<Option key={value.Wallet.Id}>{WalletFiatName}</Option>);
          }
        }
      });
    }
  }
  return WalletFiatList;
}
