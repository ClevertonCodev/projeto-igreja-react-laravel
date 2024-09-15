import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button as Botao } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import InputDate from '../../components/InputDate';
import SearchPage from '../../components/layout/SearchPage';
import InputSelect from '../../components/InputSelect';
import { findAll, destroy } from '../../services/api/Caravanas';
import { findAll as findAllEstacas } from "../../services/api/Estacas";
import { findAll as findAllveiculos } from "../../services/api/Veiculos";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

export default function IndexCaravanas({ navigation }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nome, setNome] = useState('');
    const [destino, setDestino] = useState('');
    const [quantidadePassageiros, setQuantidadePassageiros] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [status, setStatus] = useState('');
    const [msg, setMessage] = useState('');
    const [estaca, setEstaca] = useState('');
    const [estacas, setEstacas] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [veiculo, setVeiculo] = useState('');

    const getExportParams = () => {
        const params = {
            nome: nome,
            destino: destino,
            status: status,
            quantidade_passageiros: quantidadePassageiros,
            estaca_id: estaca,
            veiculo_id: veiculo,
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


    const optionsVeiculos = useCallback(() => {
        return veiculos.map((item) => ({
            value: item.veiculo_id,
            label: item.nome,
        }));
    }, [veiculos]);

    const optionsStatus = () => {
        return [
            {
                value: 1,
                label: 'ativo',
            },
            {
                value: 0,
                label: 'desativado',
            }
        ];
    };

    const getVeiculos = async () => {
        setLoading(true);
        try {
            const response = await findAllveiculos();
            if (response.veiculos) {
                setVeiculos(response.veiculos);
            }
        } catch (error) {
            setError('Ocorreu um erro desconhecido ao carregar os  veiculos');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await findAll(
                1,
                nome,
                quantidadePassageiros,
                status,
                destino,
                estaca,
                dataInicial,
                dataFinal,
                true,
            );
            if (response.caravanas) {
                setData(response.caravanas);
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
        }, [nome, destino, dataInicial, dataFinal, estaca])
    );
    useEffect(() => {
        getEstacas();
        getVeiculos();
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
        setDestino('');
        setDataInicial('');
        setDataFinal('');
        setEstaca('');
        setVeiculo('');
        setStatus('');
    }
    const handleClick = (id) => {
        navigation.navigate('Caravana', { id });
    };

    const handleCloseFlash = () => {
        setError('');
    };
    const handleClickVeiculos = (id) => {
        navigation.navigate('Veiculos Caravanas', { id });
    }
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleClick(item.id)}
        >
            <View style={styles.row}>
                <Text style={styles.primaryText}>{item.nome}</Text>
                <Text style={styles.dateText}>
                    {moment(item.data_hora_partida).format('DD/MM/YYYY')}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.secondaryText}> <Text style={styles.primaryText}>Estaca:</Text> {item.estacas.nome}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.secondaryText}> <Text style={styles.primaryText}>Destino:</Text> {item.destino}</Text>
            </View>
            <View style={styles.row}>
                <Botao title="Ver veiculos" onPress={() => handleClickVeiculos(item.id)} />
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
            modelName="Caravanas"
            exportingExcel={loading}
            msg={msg}
            data={data}
            renderItem={renderItem}
            navigation={navigation}
            title='Caravana'
            closeFlash={handleCloseFlash}
        >
            <Input
                placeholder="Nome da caravana"
                value={nome}
                onChangeText={setNome}
            />

            <Input
                placeholder="Destino"
                value={destino}
                onChangeText={setDestino}
            />

            <View style={{ width: 350 }}>
                <InputSelect
                    placeholder="Selecione a estaca"
                    value={estaca}
                    onValueChange={(itemValue) => setEstaca(itemValue)}
                    items={options()}
                />
            </View>

            <View style={{ width: 350 }}>
                <InputSelect
                    placeholder="Selecione o veiculo"
                    value={veiculo}
                    onValueChange={(itemValue) => setVeiculo(itemValue)}
                    items={optionsVeiculos()}
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

            <View style={{ width: 350 }}>
                <InputSelect
                    placeholder="Status"
                    value={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    items={optionsStatus()}
                />
            </View>

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
