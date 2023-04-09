/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, Image, TouchableOpacity,
} from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };

    this.logout = this.logout.bind(this);
  }

  handleMenuToggle = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  handleMenuItemPress = () => {
    this.setState({ menuVisible: false });
    // handle the selected menu item here
  };

  async logout() {
    console.log('Logout');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method:
        'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.props.navigation.navigate('Login');
        } else {
          throw console.log('something went wrong...');
        }
      })
      .catch((error) => {
        // this.setState({ error: error });
        console.log(error);
      });
  }

  render() {
    return (
      <Menu
        visible={this.state.menuVisible}
        anchor={(
          <TouchableOpacity onPress={this.handleMenuToggle}>
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require('../assets/dots.png')}
            />
          </TouchableOpacity>
)}
        onRequestClose={() => this.setState({ menuVisible: false })}
      >
        <MenuItem onPress={this.handleMenuItemPress}>Menu item 1</MenuItem>
        <MenuItem onPress={this.handleMenuItemPress}>Menu item 2</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
        <MenuDivider />
        <MenuItem onPress={this.logout}>Logout</MenuItem>
      </Menu>
    );
  }
}
