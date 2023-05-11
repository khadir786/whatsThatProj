import { withToastManager } from 'react-native-toast-notifications';

export const showSuccessToast = (toastManager, message) => {
  toastManager.add(message, { appearance: 'success' });
};

export const showErrorToast = (toastManager, message) => {
  toastManager.add(message, { appearance: 'error' });
};

export const showCustomToast = (toastManager, message, options) => {
  toastManager.add(message, options);
};

export const handleShowToast = (toastManager, type, message, options) => {
  if (type === 'success') {
    showSuccessToast(toastManager, message);
  } else if (type === 'error') {
    showErrorToast(toastManager, message);
  } else if (type === 'custom') {
    showCustomToast(toastManager, message, options);
  }
};

export default withToastManager;
