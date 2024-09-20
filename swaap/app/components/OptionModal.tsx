import colors from '@utils/colors';
import React, { FC } from 'react';
import { View, StyleSheet, Modal, ScrollView, Text, Pressable } from 'react-native';

interface Props<T> {
    visible: boolean;
    onRequestClose(state: boolean): void;
    options: T[];
    renderItems(item: T): JSX.Element;
    onPress(item: T): void;
}

const OptionalModal = <T extends unknown>({
    visible,  
    options, 
    onPress, 
    renderItems, 
    onRequestClose
}: Props<T>) => {
    const handleClose = () => {
        onRequestClose(!visible);
    };

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose}>
            <Pressable onPress={handleClose} style={styles.container}>
                <View style={styles.innerContainer}>
                    <ScrollView>
                        {options.map((item, index) => {
                            return (
                            <Pressable 
                                key={index} 
                                 onPress={() => { 
                                    onPress(item);
                                    handleClose();
                                }}
                            >
                                {renderItems(item)}
                            </Pressable>
                        );
                        })}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: colors.backDrop,
    },
    innerContainer: {
        width: '100%',
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 7,
        maxHeight: 200,
    },
});

export default OptionalModal;
