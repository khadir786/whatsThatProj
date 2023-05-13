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
  tabContainer: {
    flex: 1,
    backgroundColor: '#F7EBEC',
    width: '100%',
  },
  list: {
    width: '100%',
  },
  listItem: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    padding: 10,
    width: '100%',
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
  messageTitle: {
    fontWeight: 'bold',
    color: 'rgb(166, 135, 135)',
  },
  contactText: {
    fontWeight: 'bold',
    color: 'rgb(166, 135, 135)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
  },
  inputMessage: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  noDataText: {
    fontWeight: 'bold',
    color: 'rgb(166, 135, 135)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontWeight: 'bold',
    color: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
});
