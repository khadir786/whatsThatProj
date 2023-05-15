/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from './custModal';
import { styles } from './stylesheets';

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // eslint-disable-next-line react/prop-types
      selectedMessage: null,
      message: '',
      chatData: [],
      userID: null,
      isModalVisible: false,
      modalMessage: '',
      messageModalVisible: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
    this.getChatDetails();
    this.updateChat = setInterval(this.getChatDetails, 3000);
    this.setState({ userID: await AsyncStorage.getItem('whatsthat_user_id') });

    const { navigation, route } = this.props;
    const id = route.params.chat_id;
    console.log(`Chat ID: ${id}`);

    navigation.setOptions({
      title: route.params.title,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat Info', { chat_id: id })}>
          <Image source={require('../assets/info.png')} style={{ marginRight: 10, width: 20, height: 20 }} />
        </TouchableOpacity>
      ),
    });
    console.log('This is the chat screen');
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

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
      } else if (response.status === 403) {
        this.setState({ modalMessage: 'You are no longer part of this chat :(' });
        this.toggleModal();
      } else {
        console.log('Failed to fetch chat data');
        console.log(response.status);
      }
    } catch (error) { console.log(error); }
  };

  sendMessage = async () => {
    this.getChatDetails();
    if (this.state.message.trim() === '') {
      this.setState({ modalMessage: 'You need to enter something first!' });
      console.log(this.state.modalMessage);
      this.toggleModal();
      return Promise.resolve();
    }
    const toSend = {
      message: this.state.message,
    };
    const { route } = this.props;
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
    const { selectedMessage } = this.state;
    // eslint-disable-next-line eqeqeq
    const isUserMessage = item.author.user_id == this.state.userID;
    const messageContainerStyle = isUserMessage
      ? styles.userMessageContainer : styles.otherMessageContainer;
    const isItemSelected = selectedMessage && selectedMessage.message_id === item.message_id;
    const messageHighlightStyle = isItemSelected ? styles.highlightedMessage : null;

    return (
      <View>
        <TouchableHighlight
          style={[messageContainerStyle, messageHighlightStyle]}
          onPress={() => this.setState({ selectedMessage: item, messageModalVisible: true })}
          underlayColor="#F4E2E3"
        >
          <View>
            <Text style={styles.messageAuthor}>{item.author.first_name}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      selectedMessage,
      modalMessage,
      isModalVisible,
      chatData,
      messageModalVisible,
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

        <CustModal
          error={modalMessage}
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          duration={3000}
        />
      </View>
    );
  }
}
