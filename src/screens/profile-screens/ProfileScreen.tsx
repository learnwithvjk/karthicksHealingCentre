import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native';

export default function ProfileScreen({navigation}: any) {
  function navigateToVisitorsListingScreen() {
    navigation.navigate('VisitorListingScreen', {
      previousScreen: 'MainScreen',
    });
  }

  function navigateToBookingsScreen() {
    navigation.navigate('BookingListingScreen', {
      previousScreen: 'MainScreen',
    });
  }
  function navigateToReachUsPage() {
    navigation.navigate('ReachUs', {
      previousScreen: 'MainScreen',
    });
  }

  return (
    <View style={styles.buttonsWrapper}>
      <View style={styles.row}>
        <View style={styles.visitorsButtonsWrapper}>
          <TouchableOpacity
            onPress={navigateToVisitorsListingScreen}
            style={[styles.profileButton]}>
            <View style={styles.commonIconImageViewWrapper}>
              <Image
                source={require('assets/pngs/visitors.png')}
                resizeMode="contain"
                style={[styles.mediaumSizeImage]}
              />
              <Text style={styles.profileText}>Visitors</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bookingsButtonsWrapper}>
          <TouchableOpacity
            onPress={navigateToBookingsScreen}
            style={[styles.profileButton]}>
            <View style={styles.commonIconImageViewWrapper}>
              <Image
                source={require('assets/pngs/parchment.png')}
                resizeMode="contain"
                style={[styles.mediaumSizeImage]}
              />
              <Text style={styles.profileText}>Bookings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.ReachUsButtonWrapper}>
          <TouchableOpacity
            onPress={navigateToReachUsPage}
            style={[styles.profileButton]}>
            <View style={styles.commonIconImageViewWrapper}>
              <Image
                source={require('assets/pngs/personal-information.png')}
                resizeMode="contain"
                style={[styles.mediaumSizeImage]}
              />
              <Text style={styles.profileText}>Reach us</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonsWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: '33%',
  },
  visitorsButtonsWrapper: {
    flex: 1,
    alignItems: 'center',
    marginRight: 15,
  },
  bookingsButtonsWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  ReachUsButtonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  profileButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
  },
  commonIconImageViewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaumSizeImage: {
    width: 80,
    height: 80,
  },
  profileText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 20,
  },
});
