/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      selectedItem: null,
      error: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      // this.getchatData();
    });
    const { navigation, route } = this.props;
    navigation.setOptions({ title: route.params.title });
    console.log('This is the chat screen');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      isLoading,
      selectedItem,
      error,
    } = this.state;

    const { chatDetails } = this.props.route.params;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          {/* render chat messages */}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMessage}
            placeholder="Type a message"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <Button
            title="Send"
            onPress={() => {
              // handle sending message logic
            }}
          />
        </View>
      </View>
    );
  }
}
