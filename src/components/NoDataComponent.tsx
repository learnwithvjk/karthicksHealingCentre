import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

export default function NoDataComponent({label, children}: any) {
  return (
    <View style={styles.nodataWrapper}>
      <Image
        source={require('assets/pngs/inbox.png')}
        resizeMode="contain"
        style={[styles.noDataImage]}
      />
      <Text style={styles.contentText}>{label}</Text>
      <View style={styles.children}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  nodataWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    color: '#000',
    fontSize: 24,
    marginTop: 20,
  },
  noDataImage: {
    width: 280,
    height: 100,
  },
  children: {
    marginTop: 30,
  },
});
