import { Component } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/home';
import LoginView from './components/Login';
import SignUpView from './components/SignUp';
import MainNav from './components/MainNav';
import BlockedView from './components/Blocked';
import NewConvoView from './components/NewConvo';
import UserInfoView from './components/UserInfo';
import ChatView from './components/Chat';

const AuthStack = createNativeStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          initialRouteName="Home"

        >
          <AuthStack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name="Login"
            component={LoginView}
            options={{ headerShown: false }}
          />
          <AuthStack.Screen name="Sign Up" component={SignUpView} />
          <AuthStack.Screen
            name="MainApp"
            component={MainNav}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen name="Blocked" component={BlockedView} />
          <AuthStack.Screen name="New Convo" component={NewConvoView} />
          <AuthStack.Screen name="Account Information" component={UserInfoView} />
          <AuthStack.Screen name="Chat" component={ChatView} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
