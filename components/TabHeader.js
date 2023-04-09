import { Component } from 'react';
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// eslint-disable-next-line react/prefer-stateless-function
class CustomHeader extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Header Title</Text>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Text>Button</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
