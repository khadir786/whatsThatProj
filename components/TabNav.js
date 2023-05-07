import { Component } from 'react';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatsView from './Chats';
import ContactsView from './Contacts';

const Tab = createBottomTabNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class TabNav extends Component {
  render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#f0edf6',
          inactiveTintColor: '#3e2465',
          style: { backgroundColor: '#694fad' },
        }}
      >
        <Tab.Screen
          name="Chats"
          component={ChatsView}

        />
        <Tab.Screen
          name="Contacts"
          component={ContactsView}
        />
      </Tab.Navigator>
    );
  }
}
