import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
// import * as firebase from 'firebase';
import {getStatus, getBannerMessage} from 'src/api/firebase';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import {getYoutubeVideos, getSliderImages} from 'src/api/HomeScreen';
import {SliderBox} from 'react-native-image-slider-box';
import storage from '@react-native-firebase/storage';

export default function HomeScreen(params: any) {
  const [isAvalable, setAvailable] = useState(false);
  const [bannerMessage, setBannerMessage] = useState();
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const [isYoutubeUrlsLoading, setIsYoutubeUrlsLoading] = useState(true);
  const [isSliderImagesLoading, setIsSliderImagesLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    console.log('homescreen.tsx mounted');
    getStatus(setAvailable);
    getBannerMessage(setBannerMessage);
    setIsYoutubeUrlsLoading(true);
    setIsSliderImagesLoading(true);

    console.log('getting youtubeVideos');

    const getSliderImagesData = getSliderImages().then(async images => {
      console.log('updating images to state');
      console.log(images);
      const sliderImageArr = [];
      for await (const image of images) {
        const imageUrl = await storage()
          .ref(`dashboard-slider/slider-image-${image.order}.jpg`)
          .getDownloadURL();
        console.log(imageUrl);
        sliderImageArr.push(imageUrl);
      }
      setSliderImages(JSON.parse(JSON.stringify(sliderImageArr)));
    });

    const getYoutubeVideoData = getYoutubeVideos().then(videos => {
      console.log('updating youtube to state');
      console.log(videos);
      setYoutubeVideos(JSON.parse(JSON.stringify(videos)));
      console.log('setting loading false');
    });

    Promise.all([getYoutubeVideoData, getSliderImagesData])
      .catch(error => {
        console.log('homescreen:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        console.log('loading false');
        setIsYoutubeUrlsLoading(false);
        setIsSliderImagesLoading(false);
      });
    return () => {
      console.log('homescreen.tsx initialized');
    };
  }, []);

  useEffect(() => {
    console.log('karthick aviailable status');
    console.log(isAvalable);
  }, [isAvalable]);

  useEffect(() => {
    console.log('karthick bannerMessage');
    console.log(bannerMessage);
  }, [bannerMessage]);

  return (
    <View style={styles.homeScreenWrapper}>
      <ScrollView>
        <View style={styles.currentStatusWrapper}>
          <Text style={styles.bannerMessage}>{bannerMessage}</Text>
          {isAvalable && (
            <View style={styles.statusWrapper}>
              <View style={styles.greenCircle} />
              <Text style={styles.checkedOutStatus}> checked In </Text>
            </View>
          )}
          {!isAvalable && (
            <View style={styles.statusWrapper}>
              <View style={styles.greyCircle} />
              <Text style={styles.checkedOutStatus}> checked out </Text>
            </View>
          )}
        </View>

        <View style={styles.sliderBoxWrapper}>
          {isSliderImagesLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isSliderImagesLoading && (
            <SliderBox
              autoplay
              circleLoop
              dotColor="#00790D"
              ImageComponentStyle={styles.imageStyle}
              resizeMode="stretch"
              sliderBoxHeight={200}
              images={sliderImages}
            />
          )}
        </View>

        <View>
          <View style={styles.youtubeTitleWrapper}>
            <Text style={styles.youtubeTitle}> Explore more from here !! </Text>
          </View>
          <ScrollView>
            {isYoutubeUrlsLoading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {!isYoutubeUrlsLoading && (
              <View style={styles.videoWrapper}>
                {youtubeVideos.map((videoId: string, index: number) => (
                  <YoutubePlayer
                    key={index}
                    height={250}
                    play={false}
                    videoId={videoId}
                  />
                ))}
              </View>
            )}
            <View style={styles.emptyMargin} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreenWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  currentStatusWrapper: {
    backgroundColor: '#fff',
    margin: 10,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  youtubeTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  youtubeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00790D',

    marginBottom: 10,
  },
  videoWrapper: {
    margin: 10,
  },
  bannerMessage: {
    flex: 1,
    color: '#0000FF',
    fontWeight: '500',
    fontSize: 24,
  },
  statusWrapper: {
    display: 'flex',
    color: '#FF0000',
    fontWeight: '500',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenCircle: {
    color: 'green',
    backgroundColor: 'green',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  greyCircle: {
    color: '#444',
    backgroundColor: '#444',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sliderBoxWrapper: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 5,
  },
  imageStyle: {
    borderRadius: 15,
    width: '90%',
    marginTop: 5,
  },
  emptyMargin: {
    marginBottom: 80,
  },
  checkedOutStatus: {
    color: '#444',
  },
  checkedInStatus: {
    color: 'green',
  },
});
