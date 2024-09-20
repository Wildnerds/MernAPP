import { FC, useEffect } from 'react'; 
import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@utils/colors'; 
import AuthNavigator from './AuthNavigator'; 
import { updateAuthState, Profile } from 'app/store/stateAuth'; 
import client from 'app/api/client'; 
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import LoadingIcon from '@ui/LoadingIcon';
import useAuth from 'app/hooks/useAuth';
import TabNavigator from './TabNavigator';
import useCLient from 'app/hooks/useClient';
import React from 'react';
import asyncStorage, { KEYS } from '@utils/asyncStorage';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.secondary,
  },
};

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  const dispatch = useDispatch()

  const {loggedIn, authState} = useAuth()
  const {authClient} = useCLient()

  const fetchAuthstate = async () => {
    const token = await asyncStorage.get(KEYS.AUTH_TOKEN)

    if (token) {
      dispatch(updateAuthState({pending: true, profile: null}));
      const res  = await runAxiosAsync<{profile: Profile}>(authClient.get('/auth/profile', {
        headers: {
          Authorization: "Bearer " + token,
        },
      }));
      if(res){
        dispatch(updateAuthState({pending: false, profile: res.profile}));
      } else {
        dispatch(updateAuthState({pending: false, profile: null}));
      }
    }
  };

  useEffect(() => {
    fetchAuthstate();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingIcon visible={authState.pending}/>
      {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
