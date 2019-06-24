<Menu.Item key="Buy">
  <Icon type="down" />
  <span className="nav-text">Buy Order</span>
</Menu.Item>
<Menu.Item key="Sell">
  <Icon type="up" />
  <span className="nav-text">Sell Order</span>
</Menu.Item>

case "Buy":
    this.ApiCoinford.setOrderType("BUY")
    HomeForm = BuySell;
  break;
case "Sell":
    this.ApiCoinford.setOrderType("SELL")
    HomeForm = BuySell;
  break;
