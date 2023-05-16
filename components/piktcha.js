import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from './custModal';
import { styles } from './stylesheets';
import CameraTakePicture from './camera-takephoto';

export default class CameraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMessage: '',
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('camera screen');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  render() {
    const { isLoading, isModalVisible, modalMessage } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>

        {/* <CameraTakePicture /> */}

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
