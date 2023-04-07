import { Component } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// eslint-disable-next-line import/no-cycle
import Home from './components/Home';
import LoginView from './components/Login';
import SignUpView from './components/SignUp';
import MainNav from './components/MainNav';

const AuthStack = createNativeStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          initialRouteName="Home"
          screenOptions={{
            animationEnabled: true,
            animationTypeForReplace: 'slide',
          }}
        >
          <AuthStack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen name="Login" component={LoginView} />
          <AuthStack.Screen name="Sign Up" component={SignUpView} />
          <AuthStack.Screen
            name="MainApp"
            component={MainNav}
            options={{
              headerShown: false,
            }}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
