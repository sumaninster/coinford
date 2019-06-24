render() {
  return (
    <div>
      <Row gutter={16}>
        <CurrencyPair callback={this.updateUi}/>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Row gutter={16}>
            <Col span={8}>
              <Order OrderType="BUY"
              CurrencyId={this.ApiCoinford.CurrencyId}
              RateCurrencyId={this.ApiCoinford.RateCurrencyId}
              homeCallback={this.props.callback}
              callback={this.updateBuyList}
              ref={(orderForm1) => { this.orderForm1 = orderForm1; }} />
            </Col>
            <Col span={8}>
              <Order OrderType="SELL"
              CurrencyId={this.ApiCoinford.CurrencyId}
              RateCurrencyId={this.ApiCoinford.RateCurrencyId}
              homeCallback={this.props.callback}
              callback={this.updateSellList}
              ref={(orderForm2) => { this.orderForm2 = orderForm2; }} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderList) => { this.orderList = orderList; }} />
            </Col>
            <Col span={8}>
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderList) => { this.orderList = orderList; }} />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={16}>
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderListBuy) => { this.orderListBuy = orderListBuy; }} />
          </Row>
          <Row span={8}>
            <OrderList
            homeCallback={this.props.callback}
            callback={this.updateUiList}
            ref={(orderListSell) => { this.orderListSell = orderListSell; }} />
          </Row>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} >
          <OrderList
          homeCallback={this.props.callback}
          callback={this.updateUiList}
          ref={(orderList) => { this.orderList = orderList; }} />
        </Col>
        <Col span={12} > <OrderGraph /> </Col>
      </Row>
    </div>
  )
}
