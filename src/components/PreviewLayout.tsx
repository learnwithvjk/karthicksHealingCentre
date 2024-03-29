import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, StyleSheet} from 'react-native';
export const PreviewLayout = ({
  label,
  //   children,
  values,
  selectedValue,
  setSelectedValue,
}: any) => (
  <View style={{paddingVertical: 10, flex: 1}}>
    {/* <Text style={styles.label}>{label}</Text> */}
    <View style={styles.row}>
      {values.map((value: any) => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedValue === value && styles.selected]}>
          <Text
            style={[
              styles.buttonLabel,
              selectedValue === value && styles.selectedLabel,
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {/* <View style={[styles.container, {[label]: selectedValue}]}>{children}</View> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 44,
    color: '#000',
  },
});
