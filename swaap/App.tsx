
import { StatusBar } from 'react-native';
import { Platform, StyleSheet, SafeAreaView } from 'react-native';
import { DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '@utils/colors';
import AppNavigator from 'app/navigator/AppNavigator';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store from 'app/store';
import React from 'react';




const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
   ...DefaultTheme.colors,
   background: colors.secondary,
  
  },
}

export default function App() {
  return (
    <Provider store={store}>
      {/* <Modal transparent/> */}
    <SafeAreaView style={styles.container}>
      <AppNavigator/>
      <FlashMessage position='top'/>
      </SafeAreaView> 
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: colors.secondary
  },

});
