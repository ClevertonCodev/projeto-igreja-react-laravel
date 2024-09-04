import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import SearchPage from '../../components/layout/SearchPage';
import { findAll } from '../../services/api/Estacas';

export default function IndexEstacas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');

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
        try {
            const response = await findAll(
                1,
                nome,
                endereco,
                dataInicial,
                dataFinal,
                true,
            );
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [nome, endereco, dataInicial, dataFinal]);

    return (
        <SearchPage
            error={error}
            goSubmit={fetchData}
            exportExcel={getExportParams()}
            loader={loading}
            title="Título da Página"
            modelName="Estacas"
            exportingExcel={loading}
        >
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text>{item.name}</Text>
                    </View>
                )}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            />
        </SearchPage>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});
