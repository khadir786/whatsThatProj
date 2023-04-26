/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, Button, ActivityIndicator, FlatList, Modal, TextInput,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      selectedItem: null,
      error: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.unsubscribe = this.state.navigation.addListener('focus', () => {
      // this.getContacts();
    });
    console.log('This is the chat screen');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      isLoading,
      contactsData,
      isModalVisible,
      selectedItem,
      error,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (

      <View style={styles.container}>
        <Text>This is a group chat screen</Text>
      </View>
    );
  }
}
