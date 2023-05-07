import { Component } from 'react';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNav from './TabNav';
import UserInfoView from './UserInfo';
import BlockedView from './Blocked';

const Drawer = createDrawerNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class MainNav extends Component {
  render() {
    return (
      <Drawer.Navigator initialRouteName="MainApp">
        <Drawer.Screen
          name="MainApp"
          component={TabNav}
          options={{ title: 'Home' }}
        />
        <Drawer.Screen
          name="Account Information"
          component={UserInfoView}
          options={{ drawerLabel: 'Account Information' }}
        />
        <Drawer.Screen
          name="Blocked"
          component={BlockedView}
          options={{ drawerLabel: 'Blocked' }}
        />
      </Drawer.Navigator>
    );
  }
}
