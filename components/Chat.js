/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight, TouchableOpacity,
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
      chatData: [],
      userID: null,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
    this.getChatDetails();
    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      this.getChatDetails();
    });
    const { navigation, route } = this.props;
    navigation.setOptions({
      title: route.params.title,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log('Button pressed!')}>
          <Text style={{ marginRight: 10 }}>Info</Text>
        </TouchableOpacity>
      ),
    });
    console.log('This is the chat screen');
    this.setState({ userID: await AsyncStorage.getItem('whatsthat_user_id') });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getChatDetails = async () => {
    try {
      const { navigation, route } = this.props;
      const id = route.params.chat_id;
      const response = await fetch(`http://localhost:3333/api/1.0.0//chat/${id}`, {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        this.setState({ chatData: data });
      }
    } catch (error) { console.log(error); }
  };

  sendMessage = async () => {
    const toSend = {
      message: this.state.message,
    };
    const { navigation, route } = this.props;
    const id = route.params.chat_id;
    return fetch(`http://localhost:3333/api/1.0.0//chat/${id}/message`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Message Sent');
          this.getChatDetails();
          this.setState({ message: '' });
        } else if (response.status === 400) {
          this.setState({ error: 'Bad Request' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderMessage = ({ item }) => {
    // get user id from state from async storage from componentwillmount
    // eslint-disable-next-line eqeqeq
    const isUserMessage = item.author.user_id == this.state.userID;
    const messageContainerStyle = isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer;

    return (
      <View style={messageContainerStyle}>
        <Text style={styles.messageAuthor}>
          {item.author.first_name}
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      selectedMessage,
      error,
      chatData,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    const { navigation, route } = this.props;
    const id = route.params.chat_id;
    return (
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <FlatList
            data={chatData.messages}
            keyExtractor={(item) => item.message_id.toString()}
            renderItem={this.renderMessage}
            inverted
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMessage}
            placeholder="Type a message"
            onChangeText={(text) => this.setState({ message: text })}
            value={this.state.message}
          />
          <Button
            title="Send"
            onPress={this.sendMessage}
          />
        </View>
      </View>
    );
  }
}
