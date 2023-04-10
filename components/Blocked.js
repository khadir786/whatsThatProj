import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, Alert, FlatList, ScrollView, StyleSheet,
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

export default class BlockedView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedData: [],
    };
  }

  componentDidMount() {
    this.getBlocked();
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

  render() {
    return (
      <View style={styles.container}>
        <View><Text>Blocked Users</Text></View>
        <ScrollView>
          <FlatList
            data={this.state.blockedData}
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
