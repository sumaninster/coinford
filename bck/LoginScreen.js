import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';

var UserRouter = require("./UserRouter");

var baseurl = 'http://192.168.0.203:8080/';
//var baseurl = 'http://play.gen.in:8080/';

class LoginScreen extends Component {
  static navigationOptions = {
    title: "Login"
  };

  constructor(props) {
    super(props);
    var token;
    this.state = {
      username: "",
      password: "",
    };
  }

  componentDidMount() {
    try {
      fetch(baseurl + 'v1/user/token', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(function(response) {
        if(response.status == 200) {
          response.json().then(function(data) {
            token = data.Token;
            return console.log(token);
          })
        }
        else throw new Error('Something went wrong on api server!');
      })
      .then(function(response) {
        console.debug(response);
      })
    } catch (e) {
        Alert.alert(e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input
                autoCapitalize="none"
                onChange={(event) => this.setState({username: event.nativeEvent.text})}
                value={this.state.username}/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                onChange={(event) => this.setState({password: event.nativeEvent.text})}
                value={this.state.password}/>
            </Item>
          </Form>
          <Button style={styles.button} onPress={(this.onSubmitPressed.bind(this))}>
            <Text style={styles.buttontext}>Login</Text>
          </Button>
        </ScrollView>
      </View>
    );
  }

  onSubmitPressed() {
    const { navigate } = this.props.navigation;
    var data = {
      Username: this.state.username,
      Password: this.state.password,
      Token: token
    };
    try {
      fetch(baseurl + 'v1/user/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(function(response) {
        Alert.alert(response);
        if(response.status == 200) {
          //navigate('UserRouter');
        }
        else throw new Error('Something went wrong on api server!');
      })
      .then(function(response) {
        console.debug(response);
      })
    } catch (e) {
        Alert.alert(e);
    }
  }
};

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 35,
    alignItems: "stretch",
    flex: 1
  },
  button: {
    width: 190,
    backgroundColor: "#5A5656",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center"
  },
  buttontext: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  }
});

module.exports = LoginScreen;
