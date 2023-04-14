import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ScrollView, ActivityIndicator, TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class NewConvoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      convoMembers: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.getContacts();
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

  render() {
    const { isLoading, contactsData, convoMembers } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View>
          <Text>New Convo Page</Text>
        </View>
        <FlatList
          data={contactsData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => {
            const index = convoMembers.findIndex((member) => member.user_id === item.user_id);
            const isSelected = index !== -1; // true if index is not -1
            return (
              <TouchableHighlight
                onPress={() => {
                  const updatedMembers = [...convoMembers];
                  if (isSelected) {
                    updatedMembers.splice(index, 1);
                  } else {
                    updatedMembers.push(item);
                  }
                  this.setState({ convoMembers: updatedMembers }, () => {
                    console.log(this.state.convoMembers); // callback after state update
                  });
                }}
              >
                <View style={[styles.listItem, isSelected && { backgroundColor: 'lightgrey' }]}>
                  <Text>{item.first_name}</Text>
                  <Text>{item.last_name}</Text>
                  <Text>{item.email}</Text>
                </View>
              </TouchableHighlight>
            );
          }}
          ListEmptyComponent={<Text>You have no contacts. Try adding one!</Text>}
        />
      </View>
    );
  }
}
