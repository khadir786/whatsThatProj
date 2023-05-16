import 'react-native-gesture-handler';
import { Component } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNav from './src/views/MainNav';
import LoginView from './src/views/Login';
import SignUpView from './src/views/SignUp';
import BlockedView from './src/views/Blocked';
import NewConvoView from './src/views/NewConvo';
import UserInfoView from './src/views/UserInfo';
import ChatsView from './src/views/Chats';
import ChatView from './src/views/Chat';
import Home from './src/views/home';
import ChatInfoView from './src/views/ChatInfo';

const AuthStack = createNativeStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Home">
          <AuthStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <AuthStack.Screen name="MainApp" component={MainNav} options={{ headerShown: false }} />
          <AuthStack.Screen name="Login" component={LoginView} options={{ headerShown: false }} />
          <AuthStack.Screen name="Sign Up" component={SignUpView} />
          <AuthStack.Screen name="Blocked" component={BlockedView} />
          <AuthStack.Screen name="New Convo" component={NewConvoView} />
          <AuthStack.Screen name="Account Information" component={UserInfoView} />
          <AuthStack.Screen name="Chats" component={ChatsView} options={{ headerShown: false }} />
          <AuthStack.Screen name="Chat" component={ChatView} options={{ headerShown: true }} />
          <AuthStack.Screen name="Chat Info" component={ChatInfoView} options={{ headerShown: true }} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
