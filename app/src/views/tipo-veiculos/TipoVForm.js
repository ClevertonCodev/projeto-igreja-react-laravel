import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormPage from '../../components/layout/FormPage';
import Input from '../../components/Input';
import { create, findId, edit } from "../../services/api/TiposVeiculos";
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    tipo: Yup
        .string()
        .required("O tipo é obrigatório"),
});

export default function TipoVForm({ navigation }) {
    const route = useRoute();
    const { id } = route.params || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCloseFlash = () => {
        setError(null);
        setSuccess(null);
    };

    const getOne = async (id, setValues) => {
        setLoading(true);
        try {
            const response = await findId(id);
            setValues({
                tipo: response.veiculo.tipo
            });
        } catch (error) {
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
    };

    const update = async (id, values) => {
        try {
            const response = await edit(id, values);
            if (response.success) {
                setSuccess('Editado com sucesso!');
                setTimeout(() => {
                    navigation.navigate('Tipo veículos');
                }, 1500);
            }
        } catch (error) {
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
    };

    const created = async (values, resetForm) => {
        try {
            const response = await create(values);
            if (response.success) {
                setSuccess('Criado com sucesso!');
                resetForm();
            }
        } catch (error) {
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
    };

    return (
        <Formik
            initialValues={{
                tipo: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                setError(null);
                if (id) {
                    await update(id, values);
                } else {
                    await created(values, resetForm);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, setValues, values, errors, touched }) => {
                useFocusEffect(
                    useCallback(() => {
                        if (id) {
                            getOne(id, setValues);
                        }
                    }, [id])
                );

                return (
                    <FormPage
                        error={error}
                        success={success}
                        closeFlash={handleCloseFlash}
                        goSubmit={handleSubmit}
                        loading={loading}
                        title={id ? "Editar" : "Criar"}
                    >
                        <View style={styles.form}>
                            <Input
                                placeholder="Tipo veiculo"
                                value={values.tipo}
                                onChangeText={handleChange('tipo')}
                                onBlur={handleBlur('tipo')}
                                error={errors.tipo}
                            />
                            {touched.tipo && errors.tipo && <Text style={styles.error}>{errors.tipo}</Text>}
                        </View>
                    </FormPage>
                );
            }}
        </Formik>
    );
}
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
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

