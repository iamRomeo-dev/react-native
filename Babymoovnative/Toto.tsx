import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './App';

export const Toto = ({devices, isModalVisible, connectToDevice}) => {
  console.log('tototo', devices);
  // console.log('tototo', devices[0]);
  return (
    // {isModalVisible && (
    <TouchableOpacity
      onPress={connectToDevice(devices)}
      style={styles.ctaButton}>
      <Text style={styles.ctaButtonText}>{devices?.name}</Text>
    </TouchableOpacity>
    // )}
  );
};
