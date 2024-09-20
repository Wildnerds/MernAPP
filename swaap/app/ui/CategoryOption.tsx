import colors from '@utils/colors';
import React from 'react';
import  {FC} from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface Props {
    icon: JSX.Element
    name: string;
}

const CategoryOption: FC<Props> = ({icon, name}) => {
    return (
        <View style={styles.container}>
        <View style={styles.icon}>
            {icon}
        </View>
        <Text style={styles.category}>{name}</Text>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center' ,
    },
    category: {
        color: colors.primary,
        paddingVertical: 10,
    },
    icon:
    {transform: [{ scale: 0.4 }],}
}
    
)

export default CategoryOption;