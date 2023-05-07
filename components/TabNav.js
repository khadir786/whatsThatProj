import { Component } from 'react';
import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ChatsView from './Chats';
import ContactsView from './Contacts';

const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class TabNav extends Component {
  render() {
    return (
      <Tab.Navigator>
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
