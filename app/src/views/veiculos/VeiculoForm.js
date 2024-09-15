import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormPage from '../../components/layout/FormPage';
import Input from '../../components/Input';
import InputSelect from '../../components/InputSelect';
import { Formik } from 'formik';
import { create, findId, edit } from "../../services/api/Veiculos";
import { findAll } from "../../services/api/TiposVeiculos";
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    nome: Yup
        .string()
        .required("O nome é obrigatório")
        .matches(/^[A-Za-z ]+$/, 'O nome não deve conter números'),
    quantidade_lugares: Yup.number().required('A quantidade de lugares é obrigatória').typeError('A quantidade de lugares deve ser um número'),
    tipo_veiculo_id: Yup.string().required("Informar o tipo do veiculo é obrigatório"),
});

export default function VeiculoForm({ navigation }) {
    const route = useRoute();
    const { id } = route.params || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tipoVeiculos, setTipoVeiculos] = useState([]);
    const request = {
        nome: '',
        quantidade_lugares: '',
        tipo_veiculo_id: '',
    };

    const options = useCallback(() => {
        return tipoVeiculos.map((item) => ({
            value: item.id,
            label: item.tipo,
        }));
    }, [tipoVeiculos]);

    const getTipoVeiculos = async () => {
        setLoading(true);
        try {
            const response = await findAll();
            if (response.tipo_veiculos) {
                setTipoVeiculos(response.tipo_veiculos);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar os tipos de veículos');
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
            setValues(response.veiculo);
        } catch (error) {
            setError("Ocorreu um erro ao buscar os dados.");
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
                    navigation.navigate('Veículos');
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
                    await update(id, values);
                } else {
                    await created(values, resetForm);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, setValues, values, errors, touched }) => {
                useFocusEffect(
                    useCallback(() => {
                        getTipoVeiculos();
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
                                placeholder="Nome do veiculo"
                                value={values.nome}
                                onChangeText={handleChange('nome')}
                                onBlur={handleBlur('nome')}
                                error={errors.nome}
                            />
                            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

                            <Input
                                placeholder="Quantidade de lugares"
                                value={values.quantidade_lugares}
                                keyboardType="numeric"
                                onChangeText={handleChange('quantidade_lugares')}
                                onBlur={handleBlur('quantidade_lugares')}
                                error={errors.quantidade_lugares}
                            />
                            {touched.quantidade_lugares && errors.quantidade_lugares && <Text style={styles.error}>{errors.quantidade_lugares}</Text>}

                            <InputSelect
                                placeholder="Selecione o tipo do veiculo"
                                value={values.tipo_veiculo_id}
                                onValueChange={(itemValue) => {
                                    setValues({ ...values, tipo_veiculo_id: itemValue });
                                }}
                                items={options()}
                                error={errors.tipo_veiculo_id}
                            />
                            {touched.tipo_veiculo_id && errors.tipo_veiculo_id && <Text style={styles.error}>{errors.tipo_veiculo_id}</Text>}
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
