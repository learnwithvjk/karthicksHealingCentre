import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#00790D',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    color: '#000',
  },
});

// export const images = {
//   ratings: {
//     '1': require('../assets/rating-1.png'),
//     '2': require('../assets/rating-2.png'),
//     '3': require('../assets/rating-3.png'),
//     '4': require('../assets/rating-4.png'),
//     '5': require('../assets/rating-5.png'),
//   },
// };
