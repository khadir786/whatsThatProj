import 'react-native-gesture-handler';
import { Component } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNav from './components/MainNav';
import LoginView from './components/Login';
import SignUpView from './components/SignUp';
import BlockedView from './components/Blocked';
import NewConvoView from './components/NewConvo';
import UserInfoView from './components/UserInfo';
import ChatsView from './components/Chats';
import ChatView from './components/Chat';

const AuthStack = createNativeStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="MainApp">
          <AuthStack.Screen name="MainApp" component={MainNav} options={{ headerShown: false }} />
          <AuthStack.Screen name="Login" component={LoginView} options={{ headerShown: false }} />
          <AuthStack.Screen name="Sign Up" component={SignUpView} />
          <AuthStack.Screen name="Blocked" component={BlockedView} />
          <AuthStack.Screen name="New Convo" component={NewConvoView} />
          <AuthStack.Screen name="Account Information" component={UserInfoView} />
          <AuthStack.Screen name="Chats" component={ChatsView} options={{ headerShown: true }} />
          <AuthStack.Screen name="Chat" component={ChatView} options={{ headerShown: true }} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
