import React from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';

const InputSwitch = ({ value, onValueChange, label = '', disabled = false }) => {
    const isSwitchOn = value === 1;
    const handleValueChange = (newValue) => {
        onValueChange(newValue ? 1 : 0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.switchRow}>
                <Switch
                    trackColor={{ false: '#767577', true: '#4CD964' }}
                    thumbColor={isSwitchOn ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleValueChange}
                    value={isSwitchOn}
                    disabled={disabled}
                    style={styles.switch}
                />
                <Text style={styles.statusText}>{isSwitchOn ? 'Ativo' : 'Desativado'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
    },
    switchRow: {
        flexDirection: 'row', // Alinha os elementos em uma linha
        alignItems: 'center', // Centraliza verticalmente
    },
    label: {
        marginBottom: 10, // Adiciona espaçamento abaixo do rótulo
        fontSize: 16,
        textAlign: 'center', // Centraliza o texto do rótulo
    },
    switch: {
        transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
    },
    statusText: {
        marginLeft: 10, // Espaçamento entre o switch e o texto
        fontSize: 16,
    },
});

export default InputSwitch;


