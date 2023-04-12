/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
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
});

export default class ContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      isModalVisible: false,
      newContactID: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
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

  toggleModal() {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.isModalVisible}
        onRequestClose={() => this.toggleModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter contact ID"
              onChangeText={(text) => this.setState({ newContactID: text })}
              value={this.state.newContactID}
            />
            <Button title="Add" onPress={() => this.addContact()} />
            <Button title="Close" onPress={() => this.toggleModal()} />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const {
      isLoading, contactsData, isModalVisible,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    if (isModalVisible) {
      return this.renderModal();
    }

    return (
      <View style={styles.container}>
        <View>
          <Text>Contacts Screen</Text>
          <Button title="Add Contact" onPress={() => this.setState({ isModalVisible: true })} />
        </View>
        <ScrollView>
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.first_name}</Text>
                <Text>{item.last_name}</Text>
                <Text>{item.email}</Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}
