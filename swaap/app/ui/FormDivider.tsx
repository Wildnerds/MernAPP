import colors from "@utils/colors"
import React from "react"
import { FC, useState } from "react"
import { View, StyleSheet, DimensionValue, ColorValue } from "react-native"

interface Props{
    width: DimensionValue,
    height: DimensionValue,
    backgroundColor: ColorValue,
}

const FormDivider: FC<Props> = ({
    width = "50%",
    height = 2,
    backgroundColor = colors.secondary,
 
}) => {
    return (
        <View style={[styles.container,{width, height,backgroundColor}]}/>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginVertical: 10,
       bottom: 30,
        },
})

export default FormDivider