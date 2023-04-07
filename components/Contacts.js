/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Button, ActivityIndicator, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
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
    return fetch('http://localhost:3333/api/1.0.0/contacts/', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          contactsData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logout() {
    console.log('Logout');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method:
        'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.state.navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.state.navigation.navigate('Login');
        } else {
          throw console.log('something went wrong...');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <>
        <Button
          title="Logout"
          onPress={() => this.logout()}
        />
        <View style={styles.container}>
          <FlatList
            data={this.state.contactsData}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.first_name}</Text>
                <Text>{item.last_name}</Text>
                <Text>{item.email}</Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />

        </View>
        <View><Text>Contacts Screen</Text></View>
      </>
    );
  }
}

// use tab navigation for chats, contacts
