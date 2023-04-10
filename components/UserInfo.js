import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, Alert, FlatList, ScrollView, StyleSheet, ActivityIndicator,
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

export default class UserInfoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: [],
      // eslint-disable-next-line react/prop-types
    };
  }

  componentDidMount() {
    this.getUserInfo();
    this.setState({ isLoading: false });
    console.log('account info page');
  }

  async getUserInfo() {
    const userID = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch('http://localhost:3333/api/1.0.0/user/2', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          userData: [responseJson],
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
        <View><Text>Account Information</Text></View>
        <FlatList
          data={this.state.userData}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>User ID: {item.user_id}</Text>
              <Text>First Name: {item.first_name}</Text>
              <Text>Last Name: {item.last_name}</Text>
              <Text>Email: {item.email}</Text>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />

      </View>
    );
  }
}
