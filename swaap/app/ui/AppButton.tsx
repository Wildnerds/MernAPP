import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC } from "react"
import { View, StyleSheet, Pressable, Text } from "react-native"
import React from "react";

interface Props{
    title: string;
    onPress?: () => void;
    active?: boolean;
 
}


const AppButton: FC<Props> = ({title, active, onPress})  => {
    return (
    <Pressable onPress={active ? onPress : null} 
    style={[styles.button, active ? styles.btnActive : styles.btnInActive]}>
        <Text style={styles.title}>{title}</Text>
     </Pressable>
    )
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        width: "100%",
       
        marginBottom: 30,
    },
    btnActive: {
        backgroundColor: 
        colors.black},
    btnInActive: {
        backgroundColor: 
        colors.black},
    title: {
        color: colors.primary , 
        fontWeight: "700", 
        letterSpacing: 1}
});


export default AppButton