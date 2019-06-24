initialValue: 'SELF',
initialValue: 'CRYPTO',


{this.state.showCurrencyList ? (
<FormItem
  {...formItemLayout}
  label="Your Currency"
  hasFeedback
>
  {getFieldDecorator('CurrencyId', {
    rules: [{ required: true, message: 'Please select a Currency!', whitespace: true }],
  })(
    <Select
      showSearch
      style={{ width: '60%', marginRight: 8 }}
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={this.handleCurrencyChange}
      onFocus={this.handleCurrencyFocus}
      onBlur={this.handleCurrencyBlur}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
    {this.state.Currencies}
    </Select>
  )}
</FormItem>
) : null}

selectPayee(TransferType, CurrencyType, FromTo, ListLabel, Id) {
  if(TransferType == "SELF" && CurrencyType == "FIAT" && FromTo == "FROM") {
    if(ListLabel == "LIST") {
      return this.WalletFiat(Id);
    } else if(ListLabel == "LABEL") {
      return "From Wallet";
    }
  } else if(TransferType == "SELF" && CurrencyType == "FIAT" && FromTo == "TO") {
    if(ListLabel == "LIST") {
      return this.WalletFiat(Id);
    } else if(ListLabel == "LABEL") {
      return "To Wallet";
    }
  } else if(TransferType == "SELF" && CurrencyType == "CRYPTO" && FromTo == "FROM") {
    if(ListLabel == "LIST") {
      return this.WalletCrypto(Id);
    } else if(ListLabel == "LABEL") {
      return "From Wallet";
    }
  } else if(TransferType == "SELF" && CurrencyType == "CRYPTO" && FromTo == "TO") {
    if(ListLabel == "LIST") {
      return this.WalletCrypto(Id);
    } else if(ListLabel == "LABEL") {
      return "To Wallet";
    }
  } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "FROM") {
    if(ListLabel == "LIST") {
      return this.WalletCrypto(Id);
    } else if(ListLabel == "LABEL") {
      return "From Wallet";
    }
  } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "TO") {
    if(ListLabel == "LIST") {
      return this.PayeeCrypto(Id);
    } else if(ListLabel == "LABEL") {
      return "To Payee";
    }
  }
}

  selectPayee1(TransferType, CurrencyType, FromTo, ListLabel, Id) {
    console.log("selectPayee");
    console.log(TransferType, CurrencyType, FromTo, ListLabel, Id);
    var Payee = [];
    var PayeeLabel = "";
    switch (TransferType) {
      case "SELF":
        switch (CurrencyType) {
          case "FIAT":
            switch (FromTo) {
              case "FROM":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.WalletFiat(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "From Wallet";
                    break;
                  default:
                }
                break;
              case "TO":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.WalletFiat(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "To Wallet";
                    break;
                  default:
                }
                break;
              default:
            }
            break;
          case "CRYPTO":
            switch (FromTo) {
              case "FROM":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.WalletCrypto(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "From Wallet";
                    break;
                  default:
                }
                break;
              case "TO":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.WalletCrypto(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "To Wallet";
                    break;
                  default:
                }
                break;
              default:
            }
            break;
          default:
        }
        break;
      case "PAYEE":
        switch (CurrencyType) {
          case "FIAT":
            switch (FromTo) {
              case "FROM":
                switch (ListLabel) {
                  case "LIST":
                    //Payee = this.WalletCrypto();
                    break;
                  case "LABEL":
                    //PayeeLabel = "From Wallet";
                    break;
                  default:
                }
                break;
              case "TO":
                switch (ListLabel) {
                  case "LIST":
                    //Payee = this.PayeeCrypto();
                    break;
                  case "LABEL":
                    //PayeeLabel = "To Payee";
                    break;
                  default:
                }
                break;
              default:
            }
            break;
          case "CRYPTO":
            switch (FromTo) {
              case "FROM":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.WalletCrypto(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "From Wallet";
                    break;
                  default:
                }
                break;
              case "TO":
                switch (ListLabel) {
                  case "LIST":
                    Payee = this.PayeeCrypto(Id);
                    break;
                  case "LABEL":
                    PayeeLabel = "To Payee";
                    break;
                  default:
                }
                break;
              default:
            }
            break;
          default:
        }
        break;
      default:
    }
    switch (ListLabel) {
      case "LIST":
        return Payee;
        break;
      case "LABEL":
        return PayeeLabel;
        break;
      default:
    }
  }
