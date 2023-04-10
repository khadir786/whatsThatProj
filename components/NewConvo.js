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
