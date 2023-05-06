import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ScrollView, ActivityIndicator, TouchableHighlight, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class NewConvoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      convoMembers: [],
      modalVisible: null,
      convoTitle: '',
      navigation: this.props,
    };
  }

  componentDidMount() {
    this.getContacts();
    this.setState({ isLoading: false });
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

  async newConvo(convoName, members) {
    try {
      const toSend = { name: convoName };
      const response = await fetch('http://localhost:3333/api/1.0.0/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify(toSend),
      });
      if (response.status === 201) {
        const convoDetails = await response.json();
        console.log(`Conversation ID: ${convoDetails.chat_id}`);
        members.forEach((member) => {
          this.addMember(member.user_id, convoDetails.chat_id);
        });
        this.props.navigation.navigate('Chat', convoDetails.chat_id);
      }
    } catch (error) {
      console.log(error);
      console.log(convoName);
    }
  }

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

  render() {
    const {
      isLoading, contactsData, convoMembers, modalVisible, convoTitle,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    const isButtonVisible = convoMembers.length > 0; // check if at least one contact is selected
    return (

      <View style={styles.tabContainer}>
        <View>
          <Modal
            animationType="fade"
            transparent
            visible={!!modalVisible} // converts truthy to true and falsy to false
            onRequestClose={() => this.setState({ modalVisible: null })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter conversation name"
                  onChangeText={(text) => this.setState({ convoTitle: text })}
                  value={this.state.convoTitle}
                />

                <TouchableHighlight
                  style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                  onPress={() => {
                    this.newConvo(this.state.convoTitle, convoMembers);
                  }}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[styles.modalButton, { backgroundColor: 'gray' }]}
                  onPress={() => this.setState({ modalVisible: null })}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableHighlight>

              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Text>Which of your contacts should be in the conversation?</Text>
        </View>

        {isButtonVisible && (
        <TouchableHighlight
          style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
        >
          <Text style={styles.modalButtonText}>Start Conversation</Text>
        </TouchableHighlight>
        )}

        <FlatList
          data={contactsData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => {
            const index = convoMembers.findIndex((member) => member.user_id === item.user_id);
            console.log(`Index: ${index}`);
            const isSelected = index !== -1; // boolean: true if index is not -1
            return (
              <TouchableHighlight
                style={styles.listItem}
                onPress={() => {
                  const updatedMembers = [...convoMembers];
                  if (isSelected) {
                    updatedMembers.splice(index, 1);
                  } else {
                    updatedMembers.push(item);
                  }
                  this.setState({ convoMembers: updatedMembers }, () => {
                    console.log(this.state.convoMembers); // callback after state update
                  });
                }}
                underlayColor="#F4E2E3"
              >
                <View style={[styles.listItem, isSelected && { backgroundColor: '#E8C5C8' }]}>
                  <Text style={styles.contactText}>
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </Text>
                  <Text style={{ fontWeight: '200' }}>{item.email}</Text>
                </View>
              </TouchableHighlight>
            );
          }}
          ListEmptyComponent={<Text>You have no contacts. Try adding one!</Text>}
        />

      </View>
    );
  }
}
