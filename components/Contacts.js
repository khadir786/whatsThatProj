/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Button, ActivityIndicator, FlatList,
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

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View><Text>Contacts Screen</Text></View>
        <ScrollView>
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
        </ScrollView>
      </View>
    );
  }
}
