import React from 'react';
import { Menu, Icon } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class LeftMenuBeforeLogin extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinford = new ApiCoinford();
    //UiName = this.ApiCoinford.getUiName();
  }
  state = {
    current: 'Login',
  }
  handleClick = (e) => {
    this.ApiCoinford.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback();
  }
  render() {
    return (
      <Menu theme="dark" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Login']}>
        <Menu.Item key="Login">
          <Icon type="login" />
          <span className="nav-text">Login</span>
        </Menu.Item>
        <Menu.Item key="Register">
          <Icon type="user" />
          <span className="nav-text">Register</span>
        </Menu.Item>
        <Menu.Item key="About">
          <Icon type="team" />
          <span className="nav-text">About</span>
        </Menu.Item>
        <Menu.Item key="Contact">
          <Icon type="customer-service" />
          <span className="nav-text">Contact</span>
        </Menu.Item>
        <Menu.Item key="Terms">
          <Icon type="solution" />
          <span className="nav-text">Terms</span>
        </Menu.Item>
        <Menu.Item key="Blog">
          <Icon type="contacts" />
          <span className="nav-text">Blog</span>
        </Menu.Item>
      </Menu>
    );
  }
}

class LeftMenuAfterLogin extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    current: 'Dashboard',
  }
  handleClick = (e) => {
    this.ApiCoinford.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback()
  }
  render() {
    return (
      <Menu theme="dark" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Dashboard']}>
        <Menu.Item key="Dashboard">
          <Icon type="home" />
          <span className="nav-text">Dashboard</span>
        </Menu.Item>
        <Menu.Item key="Exchange">
          <Icon type="area-chart" />
          <span className="nav-text">Exchange</span>
        </Menu.Item>
        <Menu.Item key="Wallet">
          <Icon type="wallet" />
          <span className="nav-text">Wallet</span>
        </Menu.Item>
        <Menu.Item key="Payee">
          <Icon type="idcard" />
          <span className="nav-text">Payee</span>
        </Menu.Item>
        <Menu.Item key="Transfer">
          <Icon type="pay-circle-o" />
          <span className="nav-text">Transfer</span>
        </Menu.Item>
        <Menu.Item key="Profile">
          <Icon type="user" />
          <span className="nav-text">Profile</span>
        </Menu.Item>
        <Menu.Item key="Setting">
          <Icon type="setting" />
          <span className="nav-text">Setting</span>
        </Menu.Item>
        <Menu.Item key="About">
          <Icon type="team" />
          <span className="nav-text">About</span>
        </Menu.Item>
        <Menu.Item key="Contact">
          <Icon type="customer-service" />
          <span className="nav-text">Contact</span>
        </Menu.Item>
        <Menu.Item key="Terms">
          <Icon type="solution" />
          <span className="nav-text">Terms</span>
        </Menu.Item>
        <Menu.Item key="Blog">
          <Icon type="contacts" />
          <span className="nav-text">Blog</span>
        </Menu.Item>
      </Menu>
    );
  }
}

class KYCMenu extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    current: 'Address',
  }
  handleClick = (e) => {
    this.ApiCoinford.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback(e.key)
  }
  render() {
    return (
      <Menu theme="light" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Address']}>
        <Menu.Item key="Address">
          <Icon type="environment-o" />
          <span className="nav-text">Address</span>
        </Menu.Item>
        <Menu.Item key="Documents">
          <Icon type="upload" />
          <span className="nav-text">Documents</span>
        </Menu.Item>
        <Menu.Item key="Bank">
          <Icon type="bank" />
          <span className="nav-text">Bank</span>
        </Menu.Item>
      </Menu>
    );
  }
}

class ProfileMenu extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    current: 'Basic',
  }
  handleClick = (e) => {
    this.ApiCoinford.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback(e.key)
  }
  render() {
    return (
      <Menu theme="light" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Basic']}>
        <Menu.Item key="Basic">
          <Icon type="bars" />
          <span className="nav-text">Basic Details</span>
        </Menu.Item>
        <Menu.Item key="Password">
          <Icon type="lock" />
          <span className="nav-text">Password</span>
        </Menu.Item>
      </Menu>
    );
  }
}

module.exports = {
    LeftMenuBeforeLogin: LeftMenuBeforeLogin,
    LeftMenuAfterLogin: LeftMenuAfterLogin,
    KYCMenu: KYCMenu,
    ProfileMenu: ProfileMenu,
}
