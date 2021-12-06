import {firebase} from '@react-native-firebase/database'; // import {firebase} from '@react-native-firebase/firestore';

const fireBaseInstance = firebase
  .app()
  .database(
    'https://karthik-s-healing-centre-default-rtdb.asia-southeast1.firebasedatabase.app',
  );

export async function getStatus(setValue: Function) {
  fireBaseInstance.ref('is_available').on('value', (snapshot: any) => {
    setValue(!!snapshot.val());
    console.log('is-available-updated');
  });
}

export async function getBannerMessage(setValue: Function) {
  fireBaseInstance.ref('banner_message').on('value', (snapshot: any) => {
    setValue(snapshot.val());
    console.log('banner_message-updated');
  });
}
