import React from 'react';
import { Layout, Menu, Icon, Tag } from 'antd';
import TopBar from './TopBar';
import { LeftMenuBeforeLogin, LeftMenuAfterLogin } from './menu';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import Exchange from './Exchange';
import Wallet from './Wallet';
import Payee from './Payee';
import Transfer from './Transfer';
import Profile from './Profile';
import Setting from './Setting';
import About from './About';
import Contact from './Contact';
import Terms from './Terms';
import Blog from './Blog';
import ApiCoinford from '../class/ApiCoinford';

const { Header, Content, Footer, Sider } = Layout;
var LeftMenu = LeftMenuBeforeLogin;
var HomeForm = Login;

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
    //this.ApiCoinford.GetToken();
    this.ApiCoinford.loginDefault({Username: 's2', Password: '123'}, this.updateUi);
  }
  state = {
    view: "Login",
    CurrencyId: 0,
    RateCurrencyId: 0,
  }
  componentDidMount() {
  }
  updateUi() {
    if(this.ApiCoinford.isUserLogin()) {
      LeftMenu = LeftMenuAfterLogin;
      switch (this.ApiCoinford.getUiName()) {
        case "Dashboard":
            HomeForm = Dashboard;
          break;
        case "Exchange":
            HomeForm = Exchange;
          break;
        case "Wallet":
            HomeForm = Wallet;
          break;
        case "Payee":
            HomeForm = Payee;
          break;
        case "Transfer":
            HomeForm = Transfer;
          break;
        case "Profile":
            HomeForm = Profile;
          break;
        case "Setting":
            HomeForm = Setting;
          break;
        default:
      }
    } else {
      LeftMenu = LeftMenuBeforeLogin;
      switch (this.ApiCoinford.getUiName()) {
        case "Login":
            HomeForm = Login;
          break;
        case "Register":
            HomeForm = Register;
          break;
        case "ForgotPassword":
            HomeForm = ForgotPassword;
          break;
        default:

      }
    }
    switch (this.ApiCoinford.getUiName()) {
      case "About":
          HomeForm = About;
        break;
      case "Contact":
          HomeForm = Contact;
        break;
      case "Terms":
          HomeForm = Terms;
        break;
      case "Blog":
          HomeForm = Blog;
        break;
      default:
    }
    this.setState({
      view: this.ApiCoinford.getUiName(),
      CurrencyId: this.ApiCoinford.CurrencyId,
      RateCurrencyId: this.ApiCoinford.RateCurrencyId,
    });
  }
  render() {//lg //xl
    return (
		<Layout>
		  <Sider
		    breakpoint="lg"
		    collapsedWidth="0"
		    onCollapse={(collapsed, type) => { console.log(collapsed, type); }} >
		    <div className="logo" />
        <LeftMenu callback={this.updateUi} />
		  </Sider>
		  <Layout>
		    <Header style={{ background: '#fff', padding: 0 }} >
          <TopBar callback={this.updateUi} />
        </Header>
		    <Content style={{ margin: '24px 16px 0' }}>
		      <div style={{ padding: 24, background: '#fff', minHeight: 500 }}>
		        <HomeForm callback={this.updateUi}  ref={(homeForm) => { this.homeForm = homeForm; }} />
		      </div>
		    </Content>
		    <Footer style={{ textAlign: 'center' }}>
		      COINFORD ©2017
		    </Footer>
		  </Layout>
		</Layout>
    );
  }
}
module.exports = Home;
