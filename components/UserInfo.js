import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class UserInfoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: [],
      isEditable: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      // eslint-disable-next-line react/prop-types
    };
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    this.setState({ isLoading: false });
    console.log('account info page');
  }

  onClickUpdate = () => {
    const editToggle = !this.state.isEditable;
    this.setState({ isEditable: editToggle });
    console.log(`Editable: ${editToggle}`);
  };

  async getUserInfo() {
    const userID = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
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

  updateUser = async () => {
    this.onClickUpdate();
    const toSend = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    const userID = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('User updated');
          console.log('First Name: ', this.state.firstName, 'Last Name: ', this.state.lastName);
          console.log('Email: ', this.state.email, 'Password: ', this.state.password);
          await this.getUserInfo();
        } else if (response.status === 400) {
          this.setState({ error: 'Bad Request' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        {(this.state.isEditable) ? (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={this.state.firstName}
              onChangeText={(firstName) => this.setState({ firstName })}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={this.state.lastName}
              onChangeText={(lastName) => this.setState({ lastName })}
            />

            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={this.state.email}
              onChangeText={(email) => this.setState({ email })}
            />

            <TextInput
              style={styles.input}
              placeholder="********"
              value={this.state.password}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
            />

            <Button title="Update" color="#7376AB" onPress={this.updateUser} />

          </View>
        ) : (
          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>
                  User ID:
                  {' '}
                  {item.user_id}
                </Text>
                <Text>
                  First Name:
                  {' '}
                  {item.first_name}
                </Text>
                <Text>
                  Last Name:
                  {' '}
                  {item.last_name}
                </Text>
                <Text>
                  Email:
                  {' '}
                  {item.email}
                </Text>
                <Button title="Edit" color="#7376AB" onPress={this.onClickUpdate} />
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        )}

      </View>
    );
  }
}
