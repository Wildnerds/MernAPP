import  {FC} from 'react';
import {StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';

interface Props {}

export type AppStackParamList = {
    Home: undefined,
   

}

const Stack = createNativeStackNavigator<AppStackParamList>();

const ScreenNavigator: FC<Props> = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home}/>
     
      </Stack.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
       
    },
}
    
)

export default ScreenNavigator;