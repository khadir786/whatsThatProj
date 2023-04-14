import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, Alert, FlatList, ScrollView, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

export default class NewConvoView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <View><Text>New Convo Page</Text></View>
      </View>
    );
  }
}
