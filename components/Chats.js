/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, FlatList, ScrollView, TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

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
    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      this.getChats();
      console.log('Chat List Screen');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
    const {
      chatData,
      navigation,
      isLoading,
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
        <ScrollView>
          <View>
            <FlatList
              style={styles.list}
              data={chatData}
              keyExtractor={(item) => item.chat_id.toString()}
              renderItem={({ item }) => (
                <TouchableHighlight
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('Chat', {
                      title: item.name,
                      chat_id: item.chat_id,
                    });
                  }}
                  underlayColor="#F4E2E3"
                >
                  <View style={styles.listItem}>
                    <Text style={styles.messageTitle}>{item.name}</Text>
                    <Text>{item.last_message.message}</Text>
                  </View>
                </TouchableHighlight>
              )}
              ListEmptyComponent={(
                <View style={styles.noDataText}>
                  <Text style={styles.noDataText}>
                    You have no conversations. Try creating one!
                  </Text>
                </View>
)}
              ListHeaderComponent={(
                <View />
          )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
