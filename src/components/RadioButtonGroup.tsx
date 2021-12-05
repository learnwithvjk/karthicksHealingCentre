import React from 'react';
import {View, StyleSheet} from 'react-native';
import RadioButton from 'src/components/RadioButton';

export default function RadioButtonGroup(props: any) {
  return (
    <View style={[styles.radioButtonsWrapper, props.style]}>
      {props.options.map((option: any, index: number) => (
        <RadioButton
          key={index}
          color={option.color}
          label={option.label}
          optionKey={option.optionKey}
          value={props.value}
          onChange={props.onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  radioButtonsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginVertical: 15,
  },
});
