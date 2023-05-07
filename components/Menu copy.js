import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

export default function App() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const logout = async () => {
    hideMenu();
    console.log('Logout');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else {
          throw console.log('something went wrong...');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        anchor={<Text onPress={showMenu}>Show menu</Text>}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          hideMenu();
          navigation.navigate('Account Information');
        }}
        >
          Account Information
        </MenuItem>
        <MenuItem onPress={() => {
          hideMenu();
          navigation.navigate('New Convo');
        }}
        >
          New Conversation
        </MenuItem>
        <MenuItem onPress={() => {
          hideMenu();
          navigation.navigate('Blocked');
        }}
        >
          Blocked
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => {
          hideMenu();
          logout();
        }}
        >
          Logout
        </MenuItem>
      </Menu>
    </View>
  );
}
