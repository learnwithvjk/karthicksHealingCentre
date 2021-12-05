import {Alert} from 'react-native';

export function commonErrorHandler(
  error: any,
  onProceed = undefined as unknown as Function,
) {
  console.log(error);
  console.log('error type: ' + typeof error);
  let alertMessage1 = 'Something went wrong';
  const code = error
    ? error?.code
      ? error.code
      : error.toString()
    : undefined;
  console.log(error);
  let alertMessage2 = code ? code : 'Unknown error occured';
  switch (code) {
    case 'TypeError: Network request failed':
    case 'auth/network-request-failed':
    case 'auth/unknown':
      alertMessage1 = 'Unable to connect to internet';
      alertMessage2 = 'Try after sometime';
      break;
    case 'auth/operation-not-allowed':
      alertMessage1 = 'Unbale to authorize';
      alertMessage2 = 'report to developer';
      break;
  }

  Alert.alert(alertMessage1, alertMessage2, [
    {text: 'OK', onPress: onProceed ? () => onProceed() : undefined},
  ]);
}
