/* eslint-disable react/no-unstable-nested-components */
import { Component, useState } from 'react';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View, Text, TouchableOpacity, Image,
} from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import ChatsView from './Chats';
import ContactsView from './Contacts';
import MenuView from './Menu';

const Tab = createBottomTabNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class MainNav extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={ChatsView}
          options={{
            headerRight: () => (
              <MenuView navigation={this.props.navigation} />
            ),
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={ContactsView}
          options={{
            headerRight: () => (
              <MenuView navigation={this.props.navigation} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
