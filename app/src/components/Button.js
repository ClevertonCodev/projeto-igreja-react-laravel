import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, color = '#00496F' }) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
        height: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
