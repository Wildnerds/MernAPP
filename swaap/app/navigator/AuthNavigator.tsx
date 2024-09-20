import  {FC} from 'react';
import {StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import ForgotPassword from '@views/ForgetPassword';

interface Props {}

export type AuthStackParamList = {
    SignIn: undefined,
    SignUp: undefined,
    ForgotPassword: undefined,

}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: FC<Props> = (props) => {
    return (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
       
    },
}
    
)

export default AuthNavigator;