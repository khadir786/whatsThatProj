/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight, Picker,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from '../custModal';
import { styles } from '../styles/stylesheets';

export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      usersData: [],
      addContactModal: false,
      newContactID: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      selectedItem: null,
      modalMessage: '',
      isModalVisible: false,
      query: '',
      searchWhere: '',
      blockedData: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    const { navigation, route } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
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
      }
    } catch (error) { console.log(error); }
  }

  async getBlocked() {
    return fetch('http://localhost:3333/api/1.0.0/blocked/', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          blockedData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  async Search() {
    try {
      const { searchWhere, query } = this.state;
      console.log(`Query was: ${query}`);
      let request = 'http://localhost:3333/api/1.0.0/search/';
      if (query !== '') {
        request = request.concat(`?q=${query}&search_in=${searchWhere}`);
      } else {
        request = request.concat(`?search_in=${searchWhere}`);
      }
      console.log(`Request was: ${request}`);
      const response = await fetch(request, {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const users = await response.json();
        console.log(users);
        this.setState({ usersData: users });
      }
    } catch (error) { console.log(error); }
  }

  async addContact(id) {
    try {
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
        this.setState({ modalMessage: 'Contact added successfully' });
        this.toggleModal();
      } else if (response.status === 400) {
        console.log("You can't add yourself as a contact");
        this.setState({ modalMessage: "You can't add yourself as a contact" });
        this.toggleModal();
      }
    } catch (error) { console.log(error); }
  }

  async blockUser(id) {
    try {
      console.log(`Contact ID: ${id}`);
      // eslint-disable-next-line eqeqeq
      const isUserID = id == await AsyncStorage.getItem('whatsthat_user_id');
      console.log(isUserID);
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block/`, {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.setState({ modalMessage: 'User blocked successfully' });
        this.toggleModal();
      } else if (response.status === 400) {
        console.log(response);
        if (isUserID) {
          this.setState({ modalMessage: "You can't block yourself..." });
          this.toggleModal();
        } else {
          this.setState({ modalMessage: "You can't block people not in your contacts list" });
          this.toggleModal();
        }
      }
    } catch (error) { console.log(error); }
  }

  render() {
    const {
      isLoading,
      usersData,
      selectedItem,
      modalMessage,
      isModalVisible,
      query,
      searchWhere,
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMessage}
            placeholder="Search for a user..."
            onChangeText={(text) => this.setState({ query: text })}
            value={query}
          />

          <View style={styles.dropDownContainer}>
            <Picker
              style={styles.dropDown}
              selectedValue={searchWhere}
              onValueChange={(value) => this.setState({ searchWhere: value })}
            >
              <Picker.Item label="All" value="all" />
              <Picker.Item label="Contacts" value="contacts" />
            </Picker>
          </View>

          <Button
            title="Send"
            onPress={() => this.Search()}
          />
        </View>

        <FlatList
          data={usersData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.listItem}
              onPress={() => this.setState({ selectedItem: item })}
              underlayColor="#F4E2E3"
            >
              <View style={styles.listItem}>
                <Text style={styles.contactText}>
                  {item.given_name}
                  {' '}
                  {item.family_name}
                  {' #'}
                  {item.user_id}
                </Text>
                <Text style={{ fontWeight: '200' }}>{item.email}</Text>
              </View>
            </TouchableHighlight>

          )}
          ListEmptyComponent={(
            <View style={styles.noDataText}>
              <Text style={styles.noDataText}>No users found</Text>
            </View>
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
                {selectedItem?.given_name}
                {' '}
                {selectedItem?.family_name}
              </Text>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                onPress={() => {
                  this.addContact(selectedItem.user_id);
                  this.setState({ selectedItem: null });
                }}
              >
                <Text style={styles.modalButtonText}>Add Contact</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => {
                  this.blockUser(selectedItem.user_id);
                  this.setState({ selectedItem: null });
                }}
              >
                <Text style={styles.modalButtonText}>Block User</Text>
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
