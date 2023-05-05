/* eslint-disable react/no-unstable-nested-components */
import { Component, useState } from 'react';
import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatsView from './Chats';
import ContactsView from './Contacts';
import MenuView from './Menu';

// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class MainNav extends Component {
  render() {
    return (
      <Tab.Navigator
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: '#694fad' }}
      >
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
