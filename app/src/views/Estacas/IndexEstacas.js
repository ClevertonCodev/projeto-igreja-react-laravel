import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import FormPage from '../../components/FormPage';

const FormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        setLoading(true);
        setError(null);

        // Simulando uma requisição
        setTimeout(() => {
            if (formData.name === '' || formData.email === '') {
                setError('Todos os campos são obrigatórios');
            } else {
                setSuccess(true);
            }
            setLoading(false);
        }, 2000);
    };

    const handleCloseFlash = () => {
        setError(null);
        setSuccess(false);
    };

    return (
        <FormPage
            error={error}
            success={success}
            closeFlash={handleCloseFlash}
            goSubmit={handleSubmit}
            loading={loading}
            title="Cadastro"
        >
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                />
            </View>
        </FormPage>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default FormPage;
