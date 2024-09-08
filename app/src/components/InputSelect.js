import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';

export default function InputSelect({ placeholder, value, onValueChange, items, error = null }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');

    useEffect(() => {
        const selectedItem = items.find(item => item.value === value);
        if (selectedItem) {
            setSelectedLabel(selectedItem.label);
        } else {
            setSelectedLabel('');
        }
    }, [value, items]);

    const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={selectedLabel} // Exibe o rótulo correspondente ao valor
                    editable={false}
                    pointerEvents="none"
                />
                <FontAwesomeIcon icon={faSortDown} style={styles.icon} />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {items.length > 0 ? (
                        <FlatList
                            data={filteredItems}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setSelectedLabel(item.label);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text>Nenhuma opção disponível</Text>
                    )}

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 10,
    },
    input: {
        fontSize: 16,
        height: 50,
        color: '#333',
        flex: 1,
    },
    icon: {
        marginLeft: 10,
    },
    inputError: {
        borderColor: 'red', // Cor da borda em caso de erro
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
    },
});
