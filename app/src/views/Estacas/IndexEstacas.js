import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import InputDate from '../../components/InputDate';
import SearchPage from '../../components/layout/SearchPage';
import { findAll, destroy } from '../../services/api/Estacas';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

export default function IndexEstacas({ navigation }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [msg, setMessage] = useState('');

    const getExportParams = () => {
        const params = {
            nome: nome,
            endereco: endereco,
            data_inicial: dataInicial,
            data_final: dataFinal,
        };

        return params;
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await findAll(
                1,
                nome,
                endereco,
                dataInicial,
                dataFinal,
                true,
            );
            if (response.estacas) {
                setData(response.estacas);
            }

        } catch (error) {
            setError('Ocorreu um erro desconhecido.');
        } finally {
            if (data && data.length == 0) {
                setMessage('Nenhum dado cadastrado');
            } else {
                setMessage('');
            }
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [nome, endereco, dataInicial, dataFinal])
    );
    useEffect(() => {
        if (data && data.length === 0) {
            setMessage('Nenhum dado cadastrado.');
        } else {
            setMessage('');
        }
    }, [data]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await destroy(id);
            fetchData();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        }
    };
    const handleClearFilter = () => {
        setError('');
        setNome('');
        setEndereco('');
        setDataInicial('');
        setDataFinal('');
    }
    const handleClick = (id) => {
        navigation.navigate('Estaca', { id });
    };

    const handleCloseFlash = () => {
        setError('');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleClick(item.id)}
        >
            <View style={styles.row}>
                <Text style={styles.primaryText}>{item.nome}</Text>
                <Text style={styles.dateText}>
                    {moment(item.created_at).format('DD/MM/YYYY')}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.secondaryText}>{item.endereco}</Text>
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteIconContainer}
                >
                    <FontAwesomeIcon icon={faTrashAlt} color='red' />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SearchPage
            error={error}
            goSubmit={fetchData}
            exportExcel={getExportParams()}
            loader={loading}
            modelName="Estacas"
            exportingExcel={loading}
            msg={msg}
            data={data}
            renderItem={renderItem}
            navigation={navigation}
            title='Estaca'
            closeFlash={handleCloseFlash}
        >
            <Input
                placeholder="Nome da estaca"
                value={nome}
                onChangeText={setNome}
            />
            <Input
                placeholder="Endereço"
                value={endereco}
                onChangeText={setEndereco}
            />
            <InputDate
                value={dataInicial}
                placeholder="Seleciona a data inicial"
                onChange={(newDate) => setDataInicial(newDate)}
            />
            <InputDate
                value={dataFinal}
                placeholder="Seleciona a data final"
                onChange={(newDate) => setDataFinal(newDate)}
            />
            <View style={styles.buttonContainer}>
                <Button title="Limpar fitros" onPress={handleClearFilter} color="#1fd295" />
            </View>
        </SearchPage>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        backgroundColor: '#00496F',
    },
    itemContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    primaryText: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },
    secondaryText: {
        color: '#888',
        fontSize: 14,
    },
    deleteIconContainer: {
        paddingHorizontal: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#333',
    },
    buttonContainer: {
        width: 200
    }
});
