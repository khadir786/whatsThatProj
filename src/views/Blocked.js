import React, { Component } from 'react';
import {
  Text, View, FlatList, TouchableHighlight, Button, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from '../custModal';
import { styles } from '../styles/stylesheets';

export default class BlockedView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedData: [],
      selectedItem: null,
      modalMessage: '',
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.getBlocked();
  }

  async getBlocked() {
    return fetch('http://localhost:3333/api/1.0.0/blocked/', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          blockedData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  async unblock(id) {
    try {
      console.log(`Contact ID: ${id}`);
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block/`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      if (response.status === 200) {
        this.setState({ selectedItem: false });
        this.getBlocked();
        this.setState({ modalMessage: 'User unblocked successfully' });
        this.toggleModal();
      } else if (response.status === 400) {
        console.log("You can't block yourself...");
        this.setState({ modalMessage: "You can't unblock yourself..." });
        this.toggleModal();
      }
    } catch (error) { console.log(error); }
  }

  render() {
    const {
      blockedData, selectedItem, modalMessage, isModalVisible,
    } = this.state;
    return (
      <View style={styles.tabContainer}>

        <FlatList
          data={blockedData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.listItem}
              onPress={() => this.setState({ selectedItem: item })}
              underlayColor="#F4E2E3"
            >
              <View style={styles.listItem}>
                <Text style={styles.contactText}>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
                <Text style={{ fontWeight: '200' }}>{item.email}</Text>
              </View>
            </TouchableHighlight>

          )}
          ListEmptyComponent={(
            <View style={styles.noDataText}>
              <Text style={styles.noDataText}>You have no blocked users</Text>
            </View>
            )}
        />

        <Modal
          visible={!!selectedItem} // converts truthy to true and falsy to false
          transparent
          animationType="fade"
          onRequestClose={() => this.setState({ selectedItem: null })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>
                {selectedItem?.first_name}
                {' '}
                {selectedItem?.last_name}
              </Text>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: '#7376AB' }]}
                onPress={() => {
                  this.unblock(selectedItem.user_id);
                  this.setState({ selectedItem: null });
                }}
              >
                <Text style={styles.modalButtonText}>Unblock</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => { this.setState({ selectedItem: null }); }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>
        <CustModal
          error={modalMessage}
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          duration={3000}
        />
      </View>
    );
  }
}
