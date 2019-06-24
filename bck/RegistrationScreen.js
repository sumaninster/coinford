import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';

var baseurl = 'http://192.168.0.203:8080/';
//var baseurl = 'http://play.gen.in:8080/';

class RegistrationScreen extends Component {
  static navigationOptions = {
    title: "Sign Up"
  };
  
  constructor(props) {
    super(props);
    var token;
    this.state = {
      name: "",
      email: "",
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
              <Label>Full Name</Label>
              <Input 
                autoCapitalize="none"
                onChange={(event) => this.setState({name: event.nativeEvent.text})}
                value={this.state.name}/>
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input 
                autoCapitalize="none"
                onChange={(event) => this.setState({email: event.nativeEvent.text})}
                value={this.state.email}/>
            </Item>
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
            <Text style={styles.buttontext}>Submit</Text>
          </Button> 
        </ScrollView>
      </View>
    );
  }
  
  onSubmitPressed() {
    var data = { 
      Name: this.state.name,
      Email: this.state.email,
      Username: this.state.username,
      Password: this.state.password,
      Token: token
    };
    var verify_username = {
      Username: this.state.username,
      Token: token
    };    
    fetch(baseurl + 'v1/user/isuniqueusername', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verify_username),
    })    
    .then(function(response_username) {
      response_username.json().then(function(data_username) {
        if(data_username.ResponseCode == 200) {
          try {
            fetch(baseurl + 'v1/user/register', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })    
            .then(function(response_register) {
              if(response_register.status == 200) {
                return Alert.alert("Registration Successful");
              }
              else throw new Error('Something went wrong on api server!');
            })
            .then(function(response_register) {
              console.debug(response_register);
            })
          } catch (e) {
              Alert.alert(e);
          }
        } 
        else if(data_username.ResponseCode == 403) {
          return Alert.alert("Username exists. Try again.");
        }
      })
    })
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

module.exports = RegistrationScreen;