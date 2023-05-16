import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crypto from 'crypto';
import * as EmailValidator from 'email-validator';
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
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserInfo();
      console.log('account info page');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  hashPassword = (password, salt) => {
    let hash = crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
    hash += 'p1L!ow';
    // Sanitise hash
    return hash.replace(/[^a-zA-Z0-9!@#$%^&*]/g, '');
  };

  validateAndHash = async (email, password, firstName, lastName) => {
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const NAME_REGEX = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

    if (email === '' && password === '' && firstName === '' && lastName === '') {
      this.setState({ modalMessage: 'Please fill in a field' });
      this.toggleModal();
    } else if (!NAME_REGEX.test(firstName)) {
      this.setState({ modalMessage: 'Please enter a valid first name' });
      this.toggleModal();
    } else if (!NAME_REGEX.test(lastName)) {
      this.setState({ modalMessage: 'Please enter a valid last name' });
      this.toggleModal();
    } else if (!EmailValidator.validate(email)) {
      this.setState({ modalMessage: 'Please enter a valid email' });
      this.toggleModal();
    } else if (!PASSWORD_REGEX.test(password)) {
      this.setState({
        modalMessage: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character '
          + 'and it must be at least 8 characters long',
      });
      this.toggleModal();
    } else {
      this.setState({ modalMessage: '' });
      console.log('Successful Validation');
      try {
        const hashedPassword = this.hashPassword(password, 'SavourySalt');
        console.log(hashedPassword);
        return hashedPassword;
      } catch (error) {
        console.log('Error hashing password:', error);
      }
    }
    console.log('Validation Failed');
    return null;
  };

  updateUser = async () => {
    const hashedPassword = await this.validateAndHash(
      this.state.newEmail,
      this.state.newPassword,
      this.state.firstName,
      this.state.lastName,
    );
    if (hashedPassword !== null) {
      const toSend = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.newEmail,
        password: hashedPassword,
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
            console.log('Email: ', this.state.newEmail, 'Password: ', this.state.newPassword);
            await this.getUserInfo();
            this.onClickUpdate();
          } else if (response.status === 400) {
            this.setState({ modalMessage: 'Bad Request' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return Promise.resolve();
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
