import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import SearchPage from '../../components/layout/SearchPage';
import { findAll } from '../../services/api/Estacas';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import Input from '../../components/Input';
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
            console.log(error);
            setError(true);
        } finally {
            if (data && data.length == 0) {
                setMessage('msg');
            } else {
                setMessage('');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [nome, endereco, dataInicial, dataFinal]);

    useEffect(() => {
        if (data && data.length === 0) {
            setMessage('Nenhum dado encontrado.');
        } else {
            setMessage('');
        }
    }, [data]);

    const handleDelete = (id) => {
        // Função chamada quando o ícone de deletar for clicado
        console.log(`Item com ID ${id} deletado`);
    };

    const handleClick = (id) => {
        navigation.navigate('Estaca', { id });
        console.log(`Item com ID ${id} clicado`);
    };

    // Função para renderizar cada item da lista
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
                    <FontAwesomeIcon icon={faTrashAlt} />
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
        marginBottom: 5, // Adiciona espaço entre as linhas
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
});
