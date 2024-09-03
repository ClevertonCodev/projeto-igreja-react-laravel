import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Dashboard({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bem-vindo à Dashboard!</Text>
            <Button
                title="Ir para Estaca Form"
                onPress={() => navigation.navigate('Estacas')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
});
