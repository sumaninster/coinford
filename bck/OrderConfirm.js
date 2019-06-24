import React from 'react';
import { Modal, Button } from 'antd';

class OrderConfirm extends React.Component {
  state = { visible: false }
  showModal = (values) => {
    console.log(values);
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <Modal
        title="Buy Order Confirm"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="Okay"
        cancelText="Cancel"
      >
        <p>Amount: </p>
        <p>Rate: </p>
      </Modal>
  );
  }
}

module.exports = OrderConfirm;
