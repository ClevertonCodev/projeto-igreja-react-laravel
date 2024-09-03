import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function Input({ placeholder, value, onChangeText, secureTextEntry, onIconPress, icon, error = null }) {
    return (
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
            {icon && (
                <TouchableOpacity
                    onPress={onIconPress}
                >
                    {icon}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 10,
    },
    inputError: {
        borderColor: 'red', // Cor da borda em caso de erro
    },
});

