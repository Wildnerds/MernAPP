import colors from "@utils/colors";
import React from "react";
import { FC, useState } from "react"
import {  StyleSheet, TextInput, TextInputProps } from "react-native"

interface Props extends TextInputProps{}


const FormInput: FC<Props> = (props)  => {
    const [isFocused, setIsFocused] = useState(false)
    return (
  
        <TextInput style={[styles.inputBox, isFocused ? styles.borderActive : styles.borderInActive]} 
        placeholder="Email" 
        placeholderTextColor={colors.black}
        onFocus={() => {
            setIsFocused(true)
        }}
        onBlur={() => {
            setIsFocused(false)
        }}
        {...props}/>
      
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 3,
        
    },

    inputBox: {
        width: "100%",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
       
        
        
       
    },
    borderInActive: {
        borderWidth: 1, borderColor: colors.inActive
    },
    borderActive: {
        borderWidth: 1, borderColor: colors.primary
    },

    formContainer: {
        marginTop: 0,
     
    }
        
    
});


export default FormInput