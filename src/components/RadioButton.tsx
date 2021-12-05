import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function RadioButton({
  onChange,
  color,
  label,
  optionKey,
  value,
}: any) {
  return (
    <TouchableOpacity onPress={() => onChange(optionKey)}>
      <View style={[styles.optionsWrapper]}>
        <View
          style={[
            styles.nonSelectedRadio,
            color ? {borderColor: color} : undefined,
          ]}>
          {optionKey === value ? (
            <View
              style={[
                styles.selectedRadio,
                color ? {backgroundColor: color} : undefined,
              ]}
            />
          ) : null}
        </View>
        <Text
          style={[
            styles.label,
            optionKey === value ? styles.selected : undefined,
          ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  nonSelectedRadio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00790D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedRadio: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#00790D',
  },
  label: {
    fontSize: 14,
    marginLeft: 15,
    color: '#000',
    fontWeight: '500',
  },
  selected: {
    color: '#00790D',
  },
});
