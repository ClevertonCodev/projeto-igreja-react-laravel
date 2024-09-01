import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { login } from '../services/api/Auth/Auth';
import FlashMessage from '../components/FlashMessage';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function Login({ navigation }) {
    const [email, setEmail] = useState('clevertonsantoscodev@gmail.com');
    const [password, setPassword] = useState('123456');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleCloseAlert = () => {
        setError('');
    };

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Erro', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            const response = await login({ email, password });
            if (response.access_token) {
                await AsyncStorage.setItem('access_token', response.access_token);
                navigation.navigate('Dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false);
        }

    };


    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/church_jesus.png')}
                style={styles.logo}
            />
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
                onIconPress={toggleSecureTextEntry}
                icon={
                    secureTextEntry ?
                        <FontAwesomeIcon icon={faEye} />
                        :
                        <FontAwesomeIcon icon={faEyeSlash} />
                }
            />
            <FlashMessage
                message={error}
                alertType="erro"
                withFlash="100"
                onClose={handleCloseAlert}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <Button title="Entrar" onPress={handleLogin} />
            )}
            <Text style={styles.link}>Esqueci a senha!</Text>
            <Text style={styles.link}>
                Não tem cadastro?
                <Text onPress={() => navigation.navigate('Register')}
                    style={styles.linkBold}>
                    Crie uma conta
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00496F',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        backgroundColor: '#f3f3f3',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        width: 100,
        height: 200,
        marginBottom: 40,
    },
    link: {
        color: '#fff',
        marginTop: 20,
    },
    linkBold: {
        fontWeight: 'bold',
    },
});
