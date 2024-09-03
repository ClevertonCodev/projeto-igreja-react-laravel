import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importando a biblioteca de máscaras

export default function InputPhone({ placeholder, value, onChangeText, onBlur }) {
    return (
        <View style={styles.inputContainer}>
            <TextInputMask
                type={'cel-phone'}
                options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                }}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                style={styles.input} // Mantém o mesmo estilo
            />
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
});

