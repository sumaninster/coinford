<div style={{ verticalAlign: 'center', width: '100%' }}>
  <img src="image/clogo.png" style={{ verticalAlign: 'center' }} />
  <span style={{ align: 'right' }} >
    {this.ApiCoinford.UserName}
    <Button onClick={this.logout}>Logout</Button>
  </span>
  </div>
  // - {this.ApiCoinford.getUiName()}
  // style={{ color: '#d86161', fontWeight:'bold', background: '#fff', padding: 0 }} &nbsp;&nbsp;&nbsp;

  <Row>
    <Col span={6}><img src="image/clogo.png" /></Col>
    <Col span={6}>{this.ApiCoinford.getUiName()}</Col>
    <Col span={6}>{this.ApiCoinford.UserName}</Col>
    <Col span={6}><Button onClick={this.logout} style={{align: 'right'}}>Logout</Button></Col>
  </Row>

  <Row>
    <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 1 }}></Col>
    <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}></Col>
    <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 3 }}></Col>
  </Row>

  <Col xs={{ span: 6, offset: 0 }} sm={{ span: 3, offset: 0 }} md={{ span: 3, offset: 0 }} lg={{ span: 3, offset: 0 }} xl={{ span: 3, offset: 0 }}>

  </Col>
