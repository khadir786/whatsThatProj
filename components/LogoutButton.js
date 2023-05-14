import { Component } from 'react';
import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// eslint-disable-next-line react/prefer-stateless-function
export default class LogoutButton extends Component {
  logout = async () => {
    console.log('Logout');
    try {
      const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
        },
      });
      if (response.status === 200) {
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('whatsthat_user_id');
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Login');
      } else if (response.status === 401) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('whatsthat_user_id');
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Login');
      } else {
        console.log('Something went very wrong!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <DrawerContentScrollView {...this.props}>
        <DrawerItemList {...this.props} />
        <DrawerItem label="Logout" onPress={this.logout} />
      </DrawerContentScrollView>
    );
  }
  
}
