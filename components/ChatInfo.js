/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from './custModal';
import { styles } from './stylesheets';

export default class ChatInfoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatID: null,
      chatData: [],
      userID: null,
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      selectedItem: null,
      modalMessage: '',
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
    this.setState({ userID: await AsyncStorage.getItem('whatsthat_user_id') });
    this.getContacts();
    this.getChatInfo();

    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      this.getContacts();
      this.getChatInfo();
      console.log('Chat Info Screen');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getContacts() {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts/', {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const contacts = await response.json();
        this.setState({ contactsData: contacts });
      }
    } catch (error) { console.log(error); }
  }

  getChatInfo = async () => {
    this.setState({ isLoading: true });
    try {
      const { route } = this.props;
      const { chat_id } = route.params;
      const userID = await AsyncStorage.getItem('whatsthat_user_id');
      const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        headers: {
          'X-Authorization': sessionToken,
        },
      });

      if (response.status === 200) {
        const chatData = await response.json();
        this.setState({ chatData });
      } else {
        console.log('Failed to fetch chat data');
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  async addMember(memberID, chatID) {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${memberID}`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        console.log(`Added members with ID: ${memberID}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addContact() {
    try {
      const id = this.state.newContactID;
      console.log(`Contact ID: ${id}`);
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact/`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.setState({ addContactModal: false });
        this.getContacts();
      } else if (response.status === 400) {
        console.log("You can't add yourself as a contact");
        this.setState({ modalMessage: "You can't add yourself as a contact" });
        this.toggleModal();
      }
    } catch (error) { console.log(error); }
  }

  async deleteContact(id) {
    try {
      console.log(id);
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact/`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.getContacts();
      } else if (response.status === 400) {
        this.setState({ modalMessage: "You can't remove yourself as a contact" });
        this.toggleModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  iscreator() {
    if (this.state.userID == this.state.chatData.creator.user_id) {
      return true;
    }
    return false;
  }

  render() {
    const {
      isLoading, chatData, selectedItem, modalMessage, isModalVisible,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    console.log(chatData);
    console.log(chatData.members);
    // PROBLEM: THE GETCHATINFO IS DONE AFTER THE RENDER SO CHATDATA IS EMPTY HERE

    return (

      <View style={styles.tabContainer}>
        <FlatList
          data={chatData.members}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.listItem}
              onPress={() => this.setState({ selectedItem: item })}
              underlayColor="#F4E2E3"
            >
              <View style={styles.listItem}>
                <Text style={styles.contactText}>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
                <Text style={{ fontWeight: '200' }}>{item.email}</Text>
              </View>
            </TouchableHighlight>
          )}
        />

        <Modal
          visible={(!!selectedItem) && this.iscreator()} // converts truthy true and falsy to false
          transparent
          animationType="fade"
          onRequestClose={() => this.setState({ selectedItem: null })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedItem?.first_name}
                {' '}
                {selectedItem?.last_name}
              </Text>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => {
                  console.log(`Remove from ${selectedItem?.first_name} from chat?`);
                  this.setState({ selectedItem: null });
                  this.deleteContact(selectedItem.user_id);
                }}
              >
                <Text style={styles.modalButtonText}>Remove from Chat?</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => { this.setState({ selectedItem: null }); }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
