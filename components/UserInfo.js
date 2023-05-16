import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crypto from 'crypto';
import CustModal from './custModal';
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
      newEmail: '',
      newPassword: '',
      modalMessage: '',
      isModalVisible: false,
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
    this.setState((prevState) => ({
      isEditable: !prevState.isEditable,
    }));
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

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  updateUser = async () => {
    const toSend = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.newEmail,
      password: this.state.newPassword,
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
          this.setState({ modalMessage: 'User updated' });
          console.log('First Name: ', this.state.firstName, 'Last Name: ', this.state.lastName);
          console.log('Email: ', this.state.email);
          await this.getUserInfo();
        } else if (response.status === 400) {
          this.setState({ modalMessage: 'Bad Request' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { isModalVisible, modalMessage } = this.state;

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
              value={this.state.newEmail}
              onChangeText={(newEmail) => this.setState({ newEmail })}
            />

            <TextInput
              style={styles.input}
              placeholder="********"
              value={this.state.newPassword}
              secureTextEntry
              onChangeText={(newPassword) => this.setState({ newPassword })}
            />

            <Button title="Update" color="#7376AB" onPress={this.updateUser} />
            <Button title="Cancel" color="grey" onPress={this.onClickUpdate} />

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
        <CustModal
          error={modalMessage}
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          duration={3000}
        />
      </View>
    );
  }
}
