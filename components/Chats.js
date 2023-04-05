/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Text, Button, ActivityIndicator, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'react-hook-form';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ChatsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatData: [],
      error: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.setState({ token: this.checkLogged() });
  }

  getChats() {
    // return fetch('http://10.0.2.2:3333/list')
    return fetch('http://localhost:3333/api/1.0.0/chat/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chatData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLogged = async () => {
    // change var name 'token' for security
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    if (token != null) {
      return true;
    }
    return false;
  };

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
        // this.setState({ error: error });
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
            data={this.state.chatData}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.item_name}</Text>
              </View>
            )}
            keyExtractor={({ id }, index) => id}
          />
        </View>
        <View><Text>Chats Screen</Text></View>

      </>
    );
  }
}

// use tab navigation for chats, contacts
