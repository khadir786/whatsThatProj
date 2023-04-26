/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator, FlatList, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default class ChatsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatData: [],
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.getChats();
  }

  async getChats() {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/chat/', {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        const chats = await response.json();
        this.setState({ chatData: chats });
      }
    } catch (error) { console.log(error); }
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
        <ScrollView>
          <View>
            <View><Text>Chats Screen</Text></View>
            <FlatList
              data={this.state.chatData}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.last_message.message}</Text>
                </View>
              )}
              keyExtractor={(item) => item.chat_id.toString()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
