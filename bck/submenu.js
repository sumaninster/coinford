import React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class CommonMenu extends React.Component {
  state = {
    current: 'mail',
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  render() {
    return (
      <Menu theme="dark" mode="inline">
        <Menu.Item key="3">
          <Icon type="user" />
          <span className="nav-text">About</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="video-camera" />
          <span className="nav-text">Contact</span>
        </Menu.Item>
        <Menu.Item key="5">
          <Icon type="upload" />
          <span className="nav-text">Terms</span>
        </Menu.Item>
        <Menu.Item key="6">
          <Icon type="user" />
          <span className="nav-text">Blog</span>
        </Menu.Item>
      </Menu>
    );
  }
}

module.exports = CommonMenu



if (this.state.view === "login") {
  return (
    <LeftMenuBeforeLogin update={this.update} />
  );
}
if (this.state.view === "dashboard") {
  return (
    <LeftMenuAfterLogin update={this.update} />
  );
}

console.log("Login: ", this.api_coinford.IsLogin());

this.setState({
  view: "dashboard",
});

switch (e.key) {
  case '1':
    this.api_coinford.SetUiName("Login")
    break;
  case '2':
    this.api_coinford.SetUiName("Register")
    console.log(this.api_coinford.GetUiName());
    break;
  default:
}


<Radio.Group onChange={this.handleOrderTypeChange} value={OrderType} style={{ marginBottom: 8 }}>
  <Radio.Button value="BUY">BUY</Radio.Button>
  <Radio.Button value="SELL">SELL</Radio.Button>
</Radio.Group><br />


  handleOrderTypeChange = (e) => {
    const OrderType = e.target.value;
    this.setState({ OrderType });
  }
      //const { OrderType } = this.state;
<Tag color="#d86161">COINFORD</Tag>
<Tag color="#d86161">{this.api_coinford.GetUiName()}</Tag>

<RadioButton value="1">BTC</RadioButton>
<RadioButton value="2">ETH</RadioButton>
<RadioButton value="4">BCH</RadioButton>
            </RadioGroup>


            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="Address" key="1">
                Address
              </TabPane>
              <TabPane tab="Documents" key="2">
                Documents
              </TabPane>
              <TabPane tab="Bank" key="3">
                Bank
              </TabPane>
            </Tabs>
