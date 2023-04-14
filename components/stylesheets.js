import {
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    margin: '5px',
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
