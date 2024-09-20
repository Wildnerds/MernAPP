import colors from "@utils/colors";
import React from "react";
import { FC } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const heading = "Online Marketplace to Exchange and Buy with Safety!";
const subheading = "SWAAP and Buy Goods with Trust";

const WelcomeHeader: FC = () => {
    return (
        <View style={styles.container}>
            <Image 
                source={require("../../assets/56773.jpg")} 
                style={styles.image} 
                resizeMode="contain" 
                resizeMethod="auto" // Using a valid resizeMethod
            />
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subheading}>{subheading}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: colors.secondary,
    },

    image: {
        width: 300,
        height: 200,
        marginTop: 5,
    },

    heading: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 7,
        marginTop: 6,
        color: colors.black,
    },
    subheading: {
        fontWeight: "bold",
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 18, // Adjusted lineHeight for better readability
        color: colors.primary,
        paddingBottom: 20,
        fontStyle: "italic",
    },
});

export default WelcomeHeader;
