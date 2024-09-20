import React from 'react';
import  {Children, FC, ReactNode} from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

interface Props {
    children: ReactNode
}

const CustomKeyAvoidView: FC<Props> = ({children}) => {
    return (
        <KeyboardAvoidingView 
         behavior={Platform.OS === "ios" ? "padding" : "height"} 
         style={styles.container} keyboardVerticalOffset={50}>
   
           <ScrollView>
            {children}
           </ScrollView>
    
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
    },
});
    


export default CustomKeyAvoidView;