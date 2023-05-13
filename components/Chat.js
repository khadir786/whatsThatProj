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
      message: '',
      chatDetails: this.props.route.params,
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

  sendMessage = async (message) => {
    const toSend = {
      message: this.state.message,
    };

    return fetch('http://localhost:3333/api/1.0.0//chat/{chat_id}/message', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({ isLoading: false });
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

  render() {
    const {
      isLoading,
      selectedItem,
      error,
    } = this.state;

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
