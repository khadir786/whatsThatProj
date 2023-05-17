/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from '../custModal';
import { styles } from '../styles/stylesheets';

export default class ContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      addContactModal: false,
      newContactID: '',
      selectedItem: null,
      error: '',
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.getContacts();
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getContacts();
      console.log('Contacts Screen');
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
      } else if (response.status === 401) {
        this.setState({ error: 'Invalid credentials' });
        this.toggleModal();
      } else if (response.status === 500) {
        this.setState({ error: 'Internal Server Error - Try again later' });
        this.toggleModal();
      }
    } catch (error) { console.log(error); }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

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
        this.setState({ error: "You can't add yourself as a contact" });
        this.toggleModal();
      } else if (response.status === 401) {
        this.setState({ error: 'Invalid credentials' });
        this.toggleModal();
      } else if (response.status === 404) {
        this.setState({ error: 'User not found, they may have been removed' });
        this.toggleModal();
      } else if (response.status === 500) {
        this.setState({ error: 'Internal Server Error - Try again later' });
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
        this.setState({ error: "You can't remove yourself as a contact" });
        this.toggleModal();
      } else if (response.status === 401) {
        this.setState({ error: 'Invalid credentials' });
        this.toggleModal();
      } else if (response.status === 404) {
        this.setState({ error: 'User not found, they may have been removed' });
        this.toggleModal();
      } else if (response.status === 500) {
        this.setState({ error: 'Internal Server Error - Try again later' });
        this.toggleModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      isLoading,
      contactsData,
      addContactModal,
      selectedItem,
      error,
      isModalVisible,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (

      <View style={styles.tabContainer}>
        <Modal
          animationType="fade"
          transparent
          visible={addContactModal}
          onRequestClose={() => this.setState({ addContactModal: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter contact ID"
                onChangeText={(text) => this.setState({ newContactID: text })}
                value={this.state.newContactID}
              />
              <Text style={{ color: 'red' }}>{error}</Text>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                onPress={() => {
                  this.addContact();
                  this.setState({ error: '' });
                }}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => this.setState({ addContactModal: false, error: '' })}
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
          ListEmptyComponent={(
            <View style={styles.noDataText}>
              <Text style={styles.noDataText}>You have no contacts. Try adding one!</Text>
            </View>
)}
          ListHeaderComponent={(
            <Button
              color="#7376AB"
              title="Add Contact"
              onPress={() => this.setState({ addContactModal: true })}
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
        <CustModal
          error={error}
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          duration={3000}
        />
      </View>
    );
  }
}
