/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Text, Button, Alert, ActivityIndicator,
} from 'react-native';
import * as EmailValidator from 'email-validator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    margin: '5px',
  },
});
export default class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  adduser = () => {
    const toSend = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    return fetch('http://localhost:3333/api/1.0.0/user/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('User added');
          console.log('First Name: ', this.state.firstName, 'Last Name: ', this.state.lastName);
          console.log('Email: ', this.state.email, 'Password: ', this.state.password);
          this.state.navigation.navigate('Login');
        } else if (response.status === 400) {
          this.setState({ error: 'Bad Request' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  signUp = () => {
    // validate email and password:
    // check if email and password are not empty
    // check if email is valid
    // check password against regex
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const NAME_REGEX = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

    if (this.state.email === '' || this.state.password === '' || this.state.firstName === '' || this.state.lastName === '') {
      this.setState({ error: 'Please fill in each field' });
    } else if (!NAME_REGEX.test(this.state.firstName)) {
      this.setState({ error: 'Please enter a valid first name' });
    } else if (!NAME_REGEX.test(this.state.lastName)) {
      this.setState({ error: 'Please enter a valid last name' });
    } else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Please enter a valid email' });
    } else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({
        error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character '
               + '\n And it must be at least 8 characters long',
      });
    } else {
      Alert.alert('Login', `Email: ${this.state.email}\nPassword: ${this.state.password}`);
      console.log('First Name', this.state.firstName, 'Last Name', this.state.lastName, 'Email', this.state.email, 'Password', this.state.password);
      this.adduser();
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={this.state.firstName}
          onChangeText={(firstName) => this.setState({ firstName })}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={this.state.lastName}
          onChangeText={(lastName) => this.setState({ lastName })}
        />

        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          style={styles.input}
          placeholder="********"
          value={this.state.password}
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />

        <Button title="Sign Up" color="#7376AB" onPress={this.signUp} />

        <Text style={{ color: 'red' }}>{this.state.error}</Text>
      </View>
    );
  }
}
