import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormPage from '../../components/layout/FormPage';
import Input from '../../components/Input';
import InputSelect from '../../components/InputSelect';
import InputDateTime from '../../components/inputDateTime';
import InputSwitch from '../../components/InputSwitch';
import { Formik } from 'formik';
import { create, findId, edit } from "../../services/api/Caravanas";
import { findAll } from "../../services/api/Estacas";
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
const validationSchema = Yup.object().shape({
    nome: Yup
        .string()
        .required("O nome é obrigatório")
        .matches(/^[A-Za-z ]+$/, 'O nome não deve conter números'),
    destino: Yup.string().required("Destino é obrigatório"),
    quantidade_passageiros: Yup.number().required('A quantidade de passageiros é obrigatória').typeError('A quantidade de passageiros deve ser um número'),
    data_hora_partida: Yup.string().required("A data e hora de partida são é obrigatório"),
    data_hora_retorno: Yup.string().required("A data e hora de retorno são é obrigatório"),
    estaca_id: Yup.string().required("Informar a estaca é obrigatório"),
});

export default function CaravanaForm({ navigation }) {
    const route = useRoute();
    const { id } = route.params || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [estacas, setEstacas] = useState([]);
    const request = {
        nome: '',
        destino: '',
        quantidade_passageiros: '',
        data_hora_partida: '',
        data_hora_retorno: '',
        status: 1,
        estaca_id: '',
    };

    getErros = (error) => {
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
    }

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
            setError('Ocorreu um erro desconhecido ao carregar as estacas');
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
            setValues(response.caravana);
        } catch (error) {
            getErros(error);
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
                    navigation.navigate('Caravanas');
                }, 1500);
            }
        } catch (error) {
            getErros(error);
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
            getErros(error);
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
                const formattedValues = {
                    ...values,
                    data_hora_partida: moment(values.data_hora_partida).format('YYYY-MM-DD HH:mm:ss'),
                    data_hora_retorno: moment(values.data_hora_retorno).format('YYYY-MM-DD HH:mm:ss')
                };
                if (id) {
                    await update(id, formattedValues);
                } else {
                    await created(formattedValues, resetForm);
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
                                placeholder="Nome da caravana"
                                value={values.nome}
                                onChangeText={handleChange('nome')}
                                onBlur={handleBlur('nome')}
                                error={errors.nome}
                            />
                            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

                            <Input
                                placeholder="Destino"
                                value={values.destino}
                                onChangeText={handleChange('destino')}
                                onBlur={handleBlur('destino')}
                                error={errors.destino}
                            />
                            {touched.destino && errors.destino && <Text style={styles.error}>{errors.destino}</Text>}
                            <Input
                                placeholder="Quantidade de passageiros"
                                value={String(values.quantidade_passageiros)}
                                keyboardType="numeric"
                                onChangeText={handleChange('quantidade_passageiros')}
                                onBlur={handleBlur('quantidade_passageiros')}
                                error={errors.quantidade_passageiros}
                            />
                            {touched.quantidade_passageiros && errors.quantidade_passageiros && <Text style={styles.error}>{errors.quantidade_passageiros}</Text>}

                            <InputDateTime
                                placeholder="Data e hora de partida"
                                value={values.data_hora_partida}
                                onChange={(date) => setValues({ ...values, data_hora_partida: date })}
                                error={touched.data_hora_partida && errors.data_hora_partida}
                            />
                            {touched.data_hora_partida && errors.data_hora_partida && <Text style={styles.error}>{errors.data_hora_partida}</Text>}

                            <InputDateTime
                                placeholder="Data e hora de retorno"
                                value={values.data_hora_retorno}
                                onChange={(date) => setValues({ ...values, data_hora_retorno: date })}
                                error={touched.data_hora_retorno && errors.data_hora_retorno}
                            />
                            {touched.data_hora_retorno && errors.data_hora_retorno && <Text style={styles.error}>{errors.data_hora_retorno}</Text>}

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

                            <InputSwitch
                                value={values.status}
                                onValueChange={(newValue) => setValues({ ...values, status: newValue })}
                                label='Status da caravana'
                            />
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
