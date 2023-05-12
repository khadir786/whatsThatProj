import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';

class CustModal extends Component {
  componentDidMount() {
    const { isVisible, toggleModal, duration } = this.props;

    if (isVisible) {
      this.timer = setTimeout(toggleModal, duration);
    }
  }

  componentDidUpdate(prevProps) {
    const { isVisible, toggleModal, duration } = this.props;

    if (isVisible !== prevProps.isVisible) {
      clearTimeout(this.timer);

      if (isVisible) {
        this.timer = setTimeout(toggleModal, duration);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { error, isVisible, toggleModal } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        hasBackdrop={false}
        coverScreen={false}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 10 }}>
            <Text>{error}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CustModal;
