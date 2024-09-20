import  {FC} from 'react';
import {StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';
import Profile from '@views/Profile';

interface Props {}


const Stack = createNativeStackNavigator();

const ScreenNavigator: FC<Props> = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={Profile}/>
     
      </Stack.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
       
    },
}
    
)

export default ScreenNavigator;