import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormPage from '../../components/layout/FormPage';
import InputSelect from '../../components/InputSelect';
import InputDateTime from '../../components/inputDateTime';
import InputSwitch from '../../components/InputSwitch';
import { Formik } from 'formik';
import { } from "../../services/api/caravanas";
import { findAll as findAllUsers } from "../../services/api/Users";
import { getVehiclesOfCaravan } from '../../services/api/Caravanas';
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
const validationSchema = Yup.object().shape({
    veiculo_id: Yup
        .string()
        .required("o veículo é obrigatório"),
    user_id: Yup.string().required("o usuário é obrigatório"),
    funcao: Yup.number().required('A quantidade de passageiros é obrigatória').typeError('A quantidade de passageiros deve ser um número'),
    data_confirmacao: Yup.string().required("a data de confimação é obrigatório"),
});

export default function CaravanaForm({ navigation }) {
    const route = useRoute();
    const { idCaravana } = route.params || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUser] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const request = {
        caravana_id: idCaravana,
        user_id: '',
        veiculo_id: '',
        funcao: '',
        status: 1,
        data_confirmacao: '',
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
        return users.map((item) => ({
            value: item.id,
            label: item.nome,
        }));
    }, [users]);

    const optionsVeiculos = useCallback(() => {
        return users.map((item) => ({
            value: item.id,
            label: item.nome,
        }));
    }, [veiculos]);

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await findAllUsers();
            if (response.users) {
                setUser(response.users);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar as users');
        } finally {
            setLoading(false);
        }
    };

    const getVeiculos = async () => {
        setLoading(true);
        try {
            const response = await getVehiclesOfCaravan(idCaravana);
            if (response.veiculos) {
                setVeiculos(response.veiculos);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar as users');
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
                    navigation.navigate('users');
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
            {({ handleSubmit, setValues, values, errors, touched }) => {
                useFocusEffect(
                    useCallback(() => {
                        getUsers();
                        getVeiculos();
                        // if (id) {
                        //     getOne(id, setValues);
                        // }
                    }, [idCaravana])
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
                            <InputSelect
                                placeholder="Selecione o veiculo"
                                value={values.veiculo_id}
                                onValueChange={(itemValue) => {
                                    setValues({ ...values, veiculo_id: itemValue });
                                }}
                                items={options()}
                                error={errors.veiculo_id}
                            />
                            {touched.veiculo_id && errors.veiculo_id && <Text style={styles.error}>{errors.veiculo_id}</Text>}

                            <InputSelect
                                placeholder="Selecione o usuário"
                                value={values.user_id}
                                onValueChange={(itemValue) => {
                                    setValues({ ...values, user_id: itemValue });
                                }}
                                items={optionsUsers()}
                                error={errors.user_id}
                            />
                            {touched.user_id && errors.user_id && <Text style={styles.error}>{errors.user_id}</Text>}

                            <InputSelect
                                placeholder="Selecione a função"
                                value={values.funcao}
                                onValueChange={(itemValue) => {
                                    setValues({ ...values, funcao: itemValue });
                                }}
                                items={optionsFunction()}
                                error={errors.funcao}
                            />
                            {touched.funcao && errors.funcao && <Text style={styles.error}>{errors.funcao}</Text>}

                            <InputDateTime
                                placeholder="Data de confirmação"
                                value={values.data_confirmacao}
                                onChange={(date) => setValues({ ...values, data_confirmacao: date })}
                                error={touched.data_confirmacao && errors.data_confirmacao}
                            />
                            {touched.data_confirmacao && errors.data_confirmacao && <Text style={styles.error}>{errors.data_confirmacao}</Text>}

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
