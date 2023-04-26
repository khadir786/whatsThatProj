import React, { Component } from 'react';
import {
  Text, View,
} from 'react-native';

class Message extends Component {
  render() {
    const { message, sender } = this.props;
    return (
      <View>
        <Text>{this.sender}</Text>
        <Text>{this.props.message}</Text>
      </View>
    );
  }
}

export default Message;
