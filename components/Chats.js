/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator, FlatList, ScrollView,
} from 'react-native';

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
      error: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
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
            <FlatList
              data={this.state.chatData}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.last_message.message}</Text>
                </View>
              )}
              keyExtractor={({ id }, index) => id}
            />
          </View>
          <View><Text>Chats Screen</Text></View>
        </ScrollView>
      </View>
    );
  }
}
