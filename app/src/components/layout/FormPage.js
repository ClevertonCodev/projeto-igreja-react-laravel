import React from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import FlashMessage from '../FlashMessage';
import Button from '../Button';

export default function FormPage({ error, success, closeFlash, goSubmit, loading, title, children }) {

    const handleCloseAlert = () => {
        if (closeFlash) closeFlash();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.bodyContainer}>
                    {!loading ? (
                        <View>
                            <View>
                                {children}
                            </View>
                            <View>
                                {error && (
                                    <FlashMessage
                                        message={error}
                                        alertType="erro"
                                        onClose={handleCloseAlert}
                                    />
                                )}
                                {success && (
                                    <FlashMessage
                                        message={`${title} salvo com sucesso`}
                                        alertType="sucesso"
                                        onClose={handleCloseAlert}
                                    />
                                )}
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button title="Salvar" onPress={goSubmit} color="#1fd295" />
                            </View>
                        </View>
                    ) : (
                        <ActivityIndicator size="large" color="#0000ff" />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    titleContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bodyContainer: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

