import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import ScreenNavigator from './ScreenNavigator';
import ProfileNavigator from './ProfileNavigator';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import NewListing from '@views/NewListing';
import React from 'react';




const Tab = createBottomTabNavigator();

const getOptions= (iconName: string): BottomTabNavigationOptions =>{
    return{
        tabBarIcon({color, focused, size}){
            return focused? <AntDesign name={iconName as any} size={size} color="black"/> : 
            <AntDesign name={iconName as any}size={size} color={color} />
        }, title:""
    };
};

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown:false}}>
            <Tab.Screen name="HomeNavigator" component={ScreenNavigator} 
            options={getOptions("home")} />

          <Tab.Screen name="NewListing" component={NewListing} 
            options={getOptions("pluscircleo")} />

            <Tab.Screen name="ProfileNavigator" component={ProfileNavigator} 
            options={getOptions("user")}/>
        </Tab.Navigator>
    );
}



export default TabNavigator;