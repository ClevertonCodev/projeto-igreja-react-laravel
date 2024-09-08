import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import InputDate from '../../components/InputDate';
import SearchPage from '../../components/layout/SearchPage';
import InputSelect from '../../components/InputSelect';
import { findAll, destroy } from '../../services/api/Alas';
import { findAll as findAllEstacas } from "../../services/api/Estacas";
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
    const [estaca, setEstaca] = useState('');
    const [estacas, setEstacas] = useState([]);

    const getExportParams = () => {
        const params = {
            nome: nome,
            endereco: endereco,
            estaca_id: estaca,
            data_inicial: dataInicial,
            data_final: dataFinal,
        };

        return params;
    };
    const getEstacas = async () => {
        setLoading(true);
        try {
            const response = await findAllEstacas();
            if (response.estacas) {
                setEstacas(response.estacas);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar as estacas.');
        } finally {
            setLoading(false);
        }
    };

    const options = useCallback(() => {
        return estacas.map((item) => ({
            value: item.id,
            label: item.nome,
        }));
    }, [estacas]);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await findAll(
                1,
                nome,
                endereco,
                estaca,
                dataInicial,
                dataFinal,
                true,
            );
            if (response.alas) {
                setData(response.alas);
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

    const formatAlas = (alas) => {
        if (!alas || alas.length === 0) {
            return [];
        }

        return alas.map((ala) => ({
            ...ala,
            id: ala.ala_id,
        }));
    }
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [nome, endereco, dataInicial, dataFinal, estaca])
    );
    useEffect(() => {
        getEstacas();
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
        setEstaca('');
    }
    const handleClick = (id) => {
        navigation.navigate('Ala', { id });
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
                <Text style={styles.secondaryText}> <Text style={styles.primaryText}>Estaca:</Text> {item.estaca_nome}</Text>
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
            modelName="Alas"
            exportingExcel={loading}
            msg={msg}
            data={formatAlas(data)}
            renderItem={renderItem}
            navigation={navigation}
            title='Ala'
            closeFlash={handleCloseFlash}
        >
            <Input
                placeholder="Nome da Alas"
                value={nome}
                onChangeText={setNome}
            />
            <Input
                placeholder="Endereço"
                value={endereco}
                onChangeText={setEndereco}
            />
            <View style={{ width: 350 }}>
                <InputSelect
                    placeholder="Selecione a estaca"
                    value={estaca}
                    onValueChange={(itemValue) => setEstaca(itemValue)}
                    items={options()}
                />
            </View>

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
