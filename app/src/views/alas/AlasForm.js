import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormPage from '../../components/layout/FormPage';
import Input from '../../components/Input';
import InputSelect from '../../components/InputSelect';
import { Formik } from 'formik';
import { create, findId, edit } from "../../services/api/Alas";
import { findAll } from "../../services/api/Estacas";
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    nome: Yup
        .string()
        .required("O nome é obrigatório")
        .matches(/^[A-Za-z ]+$/, 'O nome não deve conter números'),
    endereco: Yup.string().required('O endereço é obrigatório'),
    estaca_id: Yup.string().required("Informar a estaca é obrigatório"),
});

export default function EstacaForm({ navigation }) {
    const route = useRoute();
    const { id } = route.params || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [estacas, setEstacas] = useState([]);
    const request = {
        nome: '',
        endereco: '',
        estaca_id: '',
    };

    const options = useCallback(() => {
        return estacas.map((item) => ({
            value: item.id,
            label: item.nome,
        }));
    }, [estacas]);

    const getEstacas = async () => {
        setLoading(true);
        try {
            const response = await findAll();
            if (response.estacas) {
                setEstacas(response.estacas);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar as estacas.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseFlash = () => {
        setError(null);
        setSuccess(null);
    };

    const getOne = async (id, setValues) => {
        setLoading(true);
        try {
            const response = await findId(id);
            setValues(response.ala);
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

    const update = async (id, values, resetForm) => {
        try {
            const response = await edit(id, values);
            if (response.success) {
                setSuccess('Editado com sucesso!');
                setTimeout(() => {
                    navigation.navigate('Alas');
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
            initialValues={request}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                setError(null);
                if (id) {
                    await update(id, values, resetForm);
                } else {
                    await created(values, resetForm);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, setValues, values, errors, touched }) => {
                useFocusEffect(
                    useCallback(() => {
                        getEstacas();
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
                                placeholder="Nome da ala"
                                value={values.nome}
                                onChangeText={handleChange('nome')}
                                onBlur={handleBlur('nome')}
                                error={errors.nome}
                            />
                            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

                            <Input
                                placeholder="Endereço"
                                value={values.endereco}
                                onChangeText={handleChange('endereco')}
                                onBlur={handleBlur('endereco')}
                                error={errors.endereco}
                            />
                            {touched.endereco && errors.endereco && <Text style={styles.error}>{errors.endereco}</Text>}

                            <InputSelect
                                placeholder="Selecione a estaca"
                                value={values.estaca_id}
                                onValueChange={(itemValue) => {
                                    setValues({ ...values, estaca_id: itemValue });
                                }}
                                items={options()}
                                error={errors.estaca_id}
                            />
                            {touched.estaca_id && errors.estaca_id && <Text style={styles.error}>{errors.estaca_id}</Text>}
                        </View>
                    </FormPage>
                );
            }}
        </Formik>
    );
}

const styles = StyleSheet.create({
    form: {
        paddingHorizontal: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});
