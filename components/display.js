import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';

export default class DisplayImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.get_profile_image();
  }

  get_profile_image() {
    fetch('http://localhost:3333/api/1.0.0/user/1/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': 'DisplayImage',
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);

        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.photo) {
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>
      );
    }
    return (<Text>Loading</Text>);
  }
}
