import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, Alert,
} from 'react-native';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      sender: '',
    };
  }

  render() {
    return (
      <View>
        <Text>{this.sender}</Text>
        <Text>{this.props.message}</Text>
      </View>
    );
  }
}
