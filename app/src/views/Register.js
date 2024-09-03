import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { register } from '../services/api/Auth/Auth';
import InputCPF from '../components/InputCPF';
import InputPhone from '../components/InputPhone';
import FlashMessage from '../components/FlashMessage';
import Input from '../components/Input';
import Button from '../components/Button';

const validationSchema = Yup.object().shape({
    nome: Yup
        .string()
        .required("O nome é obrigatório")
        .test('two-names', 'Digite o sobre nome', (value) => {
            const names = value.split(' ');
            return names.length >= 2;
        })
        .matches(/^[A-Za-z ]+$/, 'O nome não deve conter números'),
    rg: Yup.string().required('O RG é obrigatório'),
    cpf: Yup.string().required('O CPF é obrigatório'),
    telefone: Yup.string().required('O telefone é obrigatório'),
    endereco: Yup.string().required('O endereço é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
    password: Yup.string().required('A senha é obrigatória'),
});

export default function Register({ navigation }) {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sucess, setSucess] = useState('');

    const handleCloseAlert = () => {
        setError('');
        setSucess('');
    };
    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/church_jesus.png')}
                    style={styles.logo}
                />
                <Formik
                    initialValues={{
                        nome: '',
                        rg: '',
                        cpf: '',
                        telefone: '',
                        endereco: '',
                        email: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async values => {
                        setLoading(true);
                        try {
                            const response = await register(values);
                            if (response.success) {
                                setSucess('Usuário criado com sucesso');
                                setLoading(false);

                            }
                        } catch (error) {
                            setLoading(false);
                            if (error.response && error.response.status === 422) {
                                const allErrors = [];
                                const validationErrors = error.response.data.errors;

                                Object.keys(validationErrors).forEach(key => {
                                    allErrors.push(...validationErrors[key]);
                                });
                                setError(allErrors.join(', '));
                            } else if (error.response && error.response.data && error.response.data.error) {
                                setError(error.response.data.error);
                            } else {
                                setError("Ocorreu um erro desconhecido.");
                            }
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={styles.form}>
                            <Input
                                placeholder="Nome"
                                value={values.nome}
                                onChangeText={handleChange('nome')}
                                onBlur={handleBlur('nome')}
                            />
                            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

                            <Input
                                placeholder="RG"
                                value={values.rg}
                                onChangeText={handleChange('rg')}
                                onBlur={handleBlur('rg')}
                            />
                            {touched.rg && errors.rg && <Text style={styles.error}>{errors.rg}</Text>}

                            <InputCPF
                                placeholder="CPF"
                                value={values.cpf}
                                onChangeText={handleChange('cpf')}
                                onBlur={handleBlur('cpf')}
                            />
                            {touched.cpf && errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

                            <InputPhone
                                placeholder="Telefone"
                                value={values.telefone}
                                onChangeText={handleChange('telefone')}
                                onBlur={handleBlur('telefone')}
                            />
                            {touched.telefone && errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}

                            <Input
                                placeholder="Endereço"
                                value={values.endereco}
                                onChangeText={handleChange('endereco')}
                                onBlur={handleBlur('endereco')}
                            />
                            {touched.endereco && errors.endereco && <Text style={styles.error}>{errors.endereco}</Text>}

                            <Input
                                placeholder="E-mail"
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                            />
                            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                            <Input
                                placeholder="Senha"
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                secureTextEntry={secureTextEntry}
                                onIconPress={toggleSecureTextEntry}
                                icon={
                                    secureTextEntry ?
                                        <FontAwesomeIcon icon={faEye} />
                                        :
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            />
                            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                            {error ? (
                                <FlashMessage
                                    message={error}
                                    alertType="erro"
                                    onClose={handleCloseAlert}
                                />
                            ) : null}
                            {sucess ? (
                                <FlashMessage
                                    message={sucess}
                                    alertType="sucesso"
                                    onClose={handleCloseAlert}
                                />
                            ) : null}
                            {loading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <Button title="Voltar" onPress={() => navigation.goBack()} />
                                    <Button title="Cadastrar-se" onPress={handleSubmit} />

                                </View>
                            )}
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#00496F',
        alignItems: 'center',
    },
    logo: {
        backgroundColor: '#f3f3f3',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        width: 100,
        height: 200,
        marginBottom: 20,
    },
    form: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
