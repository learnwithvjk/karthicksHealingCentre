import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import {getClinicDetails} from 'src/api/HomeScreen';
import storage from '@react-native-firebase/storage';

export default function ReachUs() {
  const [clinicDetails, setClinicDetails] = useState([]);
  const [isClinicDetailsLoading, setIsClinicDetailsLoading] = useState(true);

  useEffect(() => {
    console.log('homescreen.tsx mounted');
    setIsClinicDetailsLoading(true);

    console.log('getting youtubeVideos');
    getClinicDetails()
      .then(async clinics => {
        console.log('updating clinic to state');
        console.log(clinics);
        const clinicDetail = clinics[0];
        if (clinicDetail) {
          const locationMapUrl = await storage()
            .ref(`clinic-location/location-map-${clinicDetail.order}.png`)
            .getDownloadURL();
          const appLogo = await storage().ref('app-logo.png').getDownloadURL();
          console.log(locationMapUrl);
          console.log(appLogo);
          setClinicDetails(
            JSON.parse(
              JSON.stringify({
                ...clinicDetail,
                app_logo: appLogo,
                map_location_uri: locationMapUrl,
              }),
            ),
          );
        }
      })
      .catch(error => {
        console.log('bookingListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        console.log('setting loading false');
        setIsClinicDetailsLoading(false);
      });
    return () => {
      console.log('homescreen.tsx initialized');
    };
  }, []);

  return (
    <View style={styles.ReachUsWrapper}>
      {isClinicDetailsLoading && (
        <View style={styles.activityLoadWrapper}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!isClinicDetailsLoading && (
        <ScrollView>
          <View style={styles.logoAndTitle}>
            <Image
              source={{
                uri: clinicDetails.app_logo,
              }}
              resizeMode="contain"
              style={[styles.largeSizeImage]}
            />
            <Text style={[styles.titleText]}> KARTHIK'S HEALING CENTRE </Text>
          </View>
          <View />
          {isClinicDetailsLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isClinicDetailsLoading && (
            <View style={styles.whereAreWeWrapper}>
              {/* <Text style={[styles.whereAreWeText]}> Where are we? </Text> */}
              <Text style={[styles.addressText]}>{clinicDetails.address}</Text>
              <Text style={[styles.addressText]}>
                ph: {clinicDetails.phone}
              </Text>
            </View>
          )}
          {!isClinicDetailsLoading && (
            <View style={styles.mapWrapper}>
              <TouchableOpacity
                onPress={() => Linking.openURL(clinicDetails.map_url)}>
                <Image
                  style={styles.mapImage}
                  // source={require('assets/pngs/location-map-1.png')}
                  source={{
                    uri: clinicDetails.map_location_uri,
                  }}
                />
              </TouchableOpacity>
              {/* <Text style={[styles.whereAreWeText]}> Where are we? </Text>
            <Text style={[styles.addressText]}>{clinicDetails.address}</Text>
            <Text style={[styles.addressText]}>ph: {clinicDetails.phone}</Text> */}
            </View>
          )}

          <View />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ReachUsWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityLoadWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAndTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  largeSizeImage: {
    width: 300,
    height: 220,
  },
  titleText: {
    fontSize: 18,
    color: '#D4AF37',
  },
  whereAreWeWrapper: {
    marginHorizontal: 30,
  },
  whereAreWeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  mapWrapper: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  mapImage: {
    width: Dimensions.get('window').width - 60,
    height: 220,
    backgroundColor: 'grey',
  },
});
