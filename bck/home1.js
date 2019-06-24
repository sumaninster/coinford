import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { LeftMenuBeforeLogin, LeftMenuAfterLogin } from './menu';
import LoginForm from './login';
import ApiCoinford from '../class/api_coinford';
const { Header, Content, Footer, Sider } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this);
    this.api_coinford = new ApiCoinford();
    this.api_coinford.GetToken()
  }
  state = {
    view: "login",
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  update() {
    if(this.api_coinford.IsLogin()) {
      console.log("Login: ", this.api_coinford.IsLogin());
      this.setState({
        view: "dashboard",
      });
    } else {
      this.setState({
        view: "login",
      });
    }
  }
  render() {
    if (this.state.view === "login") {
      console.log(this.state);
      return (
  		<Layout>
  		  <Sider
  		    breakpoint="lg"
  		    collapsedWidth="0"
  		    onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
  		  >
  		    <div className="logo" />
          <LeftMenuBeforeLogin update={this.update} />
  		  </Sider>
  		  <Layout>
  		    <Header style={{ background: '#fff', padding: 0 }} >
  	            COINFORD
            	</Header>
  		    <Content style={{ margin: '24px 16px 0' }}>
  		      <div style={{ padding: 24, background: '#fff', minHeight: 500 }}>
  		        <LoginForm update={this.update}/>
  		      </div>
  		    </Content>
  		    <Footer style={{ textAlign: 'center' }}>
  		      COINFORD ©2017
  		    </Footer>
  		  </Layout>
  		</Layout>
      );
    } if (this.state.view === "dashboard") {
      console.log(this.state);
      return (
  		<Layout>
  		  <Sider
  		    breakpoint="lg"
  		    collapsedWidth="0"
  		    onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
  		  >
  		    <div className="logo" />
          <LeftMenuAfterLogin update={this.update} />
  		  </Sider>
  		  <Layout>
  		    <Header style={{ background: '#fff', padding: 0 }} >
  	            COINFORD
            	</Header>
  		    <Content style={{ margin: '24px 16px 0' }}>
  		      <div style={{ padding: 24, background: '#fff', minHeight: 500 }}>
  		        <LoginForm update={this.update}/>
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
}
module.exports = Home;
