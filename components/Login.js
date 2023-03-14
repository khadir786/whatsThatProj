import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, Button, Alert } from 'react-native';
import * as EmailValidator from 'email-validator';


export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }

  login = () => {


    //validate email and password:
    //check if email and password are not empty
    //check if email is valid
    //check password against regex
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$')

    if (this.state.email === "" || this.state.password === "") {
      this.setState({ error: "Please enter email and password" });
    }

    else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: "Please enter a valid email" });
    }

    else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({
        error: "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character " +
               "\n And it must be at least 8 characters long"});
    }
    else {
      Alert.alert('Login', `Email: ${this.state.email}\nPassword: ${this.state.password}`);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='email@example.com'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        ></TextInput>

        <TextInput
          placeholder='********'
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}

        ></TextInput>

        <Button title="Login" onPress={this.login} />

        <Text style = {{color: 'red'}}>{this.state.error}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});