import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Button, FlatList, ActivityIndicator, Modal } from 'react-native';
import FlashMessage from '../../components/FlashMessage';
import { getVehiclesOfCaravan, getfreeVehicles } from '../../services/api/Caravanas';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

export default function VeiculosCaravanasLista({ navigation }) {
    const route = useRoute();
    const { id } = route.params || {};
    const [data, setData] = useState([]);
    const [dataModal, setDataModal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [msg, setMessage] = useState('');
    const [error, setError] = useState('');
    const [veiculosSelecionado, setSelecionado] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchData = async (id) => {
        setLoading(true);
        setError(false);
        try {
            const response = await getVehiclesOfCaravan(id);
            if (response.caravanas_veiculos) {
                setData([response.caravanas_veiculos]);
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

    const handleCloseAlert = () => {
        setMessage('');
    };

    useFocusEffect(
        useCallback(() => {
            fetchData(id);
        }, [])
    );

    useEffect(() => {
        if (data && data.length === 0) {
            setMessage('Nenhum dado cadastrado');
        } else {
            setMessage('');
        }
    }, [data])

    const getVeiculosLivres = async () => {
        setLoadingModal(true);
        try {
            const response = await getfreeVehicles(id);
            setDataModal(response.veiculos_livres);
            setModalVisible(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingModal(false);
        }
    };

    const verificarSelecionado = (id) => {
        const selecionadoIndex = veiculosSelecionado.indexOf(id);

        if (selecionadoIndex === -1) {
            setSelecionado([...veiculosSelecionado, id]);
        } else {
            setSelecionado(veiculosSelecionado.filter(item => item !== id));
        }
    };

    const handlerClickVeiculos = () => {
        navigation.navigate('Veículo')
    }
    const renderItem = ({ item }) => {
        return (
            <View>
                {item.veiculos.map((veiculo, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer}>
                        <View style={styles.row}>
                            <Text style={styles.primaryText}>{veiculo.nome}</Text>
                            <Text style={styles.dateText}>{moment(item.data_hora_partida).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.secondaryText}>
                                <Text style={styles.primaryText}>Estaca:</Text> {veiculo.tipo_veiculos.tipo}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.secondaryText}>
                                <Text style={styles.primaryText}>Destino:</Text> {veiculo.quantidade_lugares}
                            </Text>

                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderModalItem = ({ item }) => {
        const isSelected = veiculosSelecionado.includes(item.id);

        return (
            <TouchableOpacity
                onPress={() => verificarSelecionado(item.id)}
                style={[styles.itemContainer, isSelected && styles.itemSelected]}
            >
                <View style={styles.row}>
                    <Text style={styles.primaryText}>
                        <Text style={styles.primaryText}>Tipo do veículo: </Text>{item.tipo_veiculo.tipo}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.primaryText}>
                        <Text style={styles.primaryText}>Nome: </Text>{item.nome}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.primaryText}>
                        <Text style={styles.primaryText}>Lugares: </Text>{item.quantidade_lugares}
                    </Text>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={styles.deleteIconContainer}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} color='red' />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.itemContainer}>
            <View style={styles.buttonContainer}>
                <Button title="Adicionar Veículos" onPress={getVeiculosLivres} />
            </View>
            {!loading ? (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.listContainer}
                />
            ) : (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
            {msg ? (
                <View style={{ marginTop: 10 }}>
                    <FlashMessage
                        message={msg}
                        alertType="warning"
                        onClose={handleCloseAlert}
                    />
                </View>
            ) : null}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Veículos Disponíveis</Text>
                        {loadingModal ? (
                            <ActivityIndicator size="large" color="#000" />
                        ) : (
                            <View style={styles.containerList}>
                                <FlatList
                                    data={dataModal}
                                    renderItem={renderModalItem}
                                    keyExtractor={item => item.id.toString()}
                                    style={styles.listContainer}
                                />
                            </View>
                        )}
                        <View style={{ marginTop: 10 }}>
                            <View>
                                <Button title="Criar novo veículo" onPress={() => handlerClickVeiculos()} />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Button title="Cadastrar veículo na caravana" onPress={() => handlerClickVeiculos()} />
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Button title="Fechar" color="red" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%'
    },
    containerList: {
        maxHeight: '70%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    primaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginVertical: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 10,
        backgroundColor: '#00496F',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00496F',
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
    itemSelected: {
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.8
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
    buttonContainerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
