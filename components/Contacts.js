/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableOpacity, TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

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
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default class ContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      isModalVisible: null,
      newContactID: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      selectedItem: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      this.getContacts();
    });
    console.log('test');
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
        this.toggleModal();
        this.getContacts();
      } else if (response.status === 400) {
        console.log("You can't add yourself as a contact");
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
        console.log("You can't remove yourself as a contact");
      }
    } catch (error) {
      console.log(error);
    }
  }

  toggleModal() {
    const curState = this.state.isModalVisible;
    this.setState(() => ({
      isModalVisible: !curState,
    }));
  }

  render() {
    const {
      isLoading,
      contactsData,
      isModalVisible,
      selectedItem,
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
        <Modal
          animationType="fade"
          transparent
          visible={!!isModalVisible} // converts truthy to true and falsy to false
          onRequestClose={() => this.setState({ isModalVisible: null })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter contact ID"
                onChangeText={(text) => this.setState({ newContactID: text })}
                value={this.state.newContactID}
              />
              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                onPress={() => this.addContact()}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => this.toggleModal()}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <FlatList
          data={contactsData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => this.setState({ selectedItem: item })}
            >
              <View style={styles.listItem}>
                <Text>{item.first_name}</Text>
                <Text>{item.last_name}</Text>
                <Text>{item.email}</Text>
              </View>
            </TouchableHighlight>
          )}
          ListEmptyComponent={<Text>You have no contacts. Try adding one!</Text>}
          ListHeaderComponent={(
            <Button
              title="Add Contact"
              onPress={() => this.setState({ isModalVisible: true })}
            />
          )}
        />
        <Modal
          visible={!!selectedItem} // converts truthy to true and falsy to false
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
                style={[styles.modalButton, { backgroundColor: 'green' }]}
                onPress={() => {
                  console.log(`Start conversation with ${selectedItem?.first_name}`);
                  this.setState({ selectedItem: null });
                }}
              >
                <Text style={styles.modalButtonText}>Start Conversation</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => {
                  console.log(`Delete contact ${selectedItem?.first_name}`);
                  this.setState({ selectedItem: null });
                  this.deleteContact(selectedItem.user_id);
                }}
              >
                <Text style={styles.modalButtonText}>Delete Contact</Text>
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
      </View>
    );
  }
}
