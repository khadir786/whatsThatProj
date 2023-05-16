/* eslint-disable react/prop-types */
/* eslint-disable global-require */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from '../custModal';
import { styles } from '../styles/stylesheets';

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
      currentMessage: '',
      newMessage: '',
      messageID: null,
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
        <TouchableOpacity onPress={() => navigation.navigate('Chat Info', { chat_id: id })}>
          <Image source={require('../../assets/info.png')} style={{ marginRight: 10, width: 20, height: 20 }} />
        </TouchableOpacity>
      ),
    });
    console.log('This is the chat screen');
  }

  componentWillUnmount() {
    clearInterval(this.updateChat);
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  getChatDetails = async () => {
    try {
      console.log('update chat called');
      const { route } = this.props;
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
          this.setState({ modalMessage: 'Bad Request' });
          this.toggleModal();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteMessage = async (messageID) => {
    const { route } = this.props;
    const id = route.params.chat_id;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${id}/message/${messageID}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ modalMessage: 'Message deleted!' });
          this.toggleModal();
        } else if (response.status === 400) {
          this.setState({ modalMessage: 'Bad Request' });
          this.toggleModal();
        } else if (response.status === 403) {
          this.setState({ modalMessage: "You can't delete someone else's message!" });
          this.toggleModal();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateMessage = async (messageEdit, messageID) => {
    if (messageEdit === '') {
      this.setState({ modalMessage: 'You need to enter something first!' });
      this.toggleModal();
      return Promise.resolve();
    }
    const toSend = {
      message: messageEdit,
    };
    const { route } = this.props;
    const id = route.params.chat_id;
    return fetch(`http://localhost:3333/api/1.0.0//chat/${id}/message/${messageID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ modalMessage: 'Message Updated!' });
          this.toggleModal();
        } else if (response.status === 400) {
          this.setState({ modalMessage: 'Bad Request' });
          this.toggleModal();
        } else if (response.status === 403) {
          this.setState({ modalMessage: "You can't edit someone else's message!" });
          this.toggleModal();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderMessage = ({ item }) => {
    const {
      selectedMessage,
      userID,
      messageModalVisible,
      modalMessage,
      currentMessage,
      newMessage,
      messageID,
    } = this.state;
    // eslint-disable-next-line eqeqeq
    const isUserMessage = item.author.user_id == userID;
    const messageContainerStyle = isUserMessage
      ? styles.userMessageContainer : styles.otherMessageContainer;
    const isItemSelected = selectedMessage && selectedMessage.message_id === item.message_id;
    const messageHighlightStyle = isItemSelected ? styles.highlightedMessage : null;

    return (
      <View>
        <TouchableHighlight
          style={[messageContainerStyle, messageHighlightStyle]}
          onPress={() => this.setState({
            selectedMessage: item,
            messageModalVisible: true,
            currentMessage: item.message,
            messageID: item.message_id,
          })}
          underlayColor="#F4E2E3"
        >
          <View>
            <Text style={styles.messageAuthor}>{item.author.first_name}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </TouchableHighlight>

        <Modal
          animationType="fade"
          transparent
          visible={messageModalVisible}
          onRequestClose={() => this.setState({ messageModalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Edit message"
                onChangeText={(text) => this.setState({ newMessage: text })}
                defaultValue={currentMessage}
              />

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                onPress={() => {
                  this.updateMessage(newMessage, messageID);
                  this.setState({ messageModalVisible: false });
                }}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => {
                  this.deleteMessage(messageID);
                  this.setState({ messageModalVisible: false });
                }}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => this.setState({ messageModalVisible: false, modalMessage: '' })}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      modalMessage,
      isModalVisible,
      chatData,
      message,
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
            value={message}
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
