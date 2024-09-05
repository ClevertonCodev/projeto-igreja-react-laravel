import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import api from '../../services/AxiosConfig';
import * as Sharing from 'expo-sharing';

export default function SearchPage({
    data = [],
    renderItem,
    error = false,
    exportExcel = [],
    loader = false,
    modelName = null,
    exportingExcel = false,
    msg,
    children,
}) {
    const [isExporting, setIsExporting] = useState(exportingExcel);
    const [footerExpanded, setFooterExpanded] = useState(false); // Controle para expandir o rodapé

    const ExcelExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const response = await api.get(
                `/export?model=${modelName || 'defaultModelName'}`,
                {
                    params: exportExcel,
                    responseType: 'arraybuffer',
                }
            );
            const base64Data = btoa(
                new Uint8Array(response.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = `${FileSystem.documentDirectory}${modelName || 'defaultModelName'}.xlsx`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(fileUri);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível exportar para Excel.');
        } finally {
            setIsExporting(false);
        }
    };

    const toggleFooter = () => {
        setFooterExpanded(!footerExpanded);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.cardBody}>
                    <View style={styles.exportButtonContainer}>
                        <Button
                            title="Exportar Excel"
                            onPress={ExcelExport}
                            disabled={isExporting}
                        />
                    </View>
                    {!loader ? (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()} // Converte o id em string
                            style={styles.listContainer}
                        />
                    ) : (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    )}
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { opacity: error ? 1 : 0 }]}>
                            {error && 'Ocorreu um erro!'}
                        </Text>
                    </View>
                    {msg ? (
                        <View style={styles.errorContainer}>
                            <Text style={[styles.errorText, { opacity: msg ? 1 : 0 }]}>
                                {msg}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
            <TouchableOpacity onPress={toggleFooter} style={styles.footer}>
                {!footerExpanded && (
                    <Text style={styles.footerText}>
                        Mais opções
                    </Text>
                )}
                {footerExpanded && (
                    <View style={styles.expandedContent}>
                        {children}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flexGrow: 1,
        padding: 16,
        overflow: 'scroll'
    },
    cardBody: {
        backgroundColor: '#00496F',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        flex: 1,
    },
    exportButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    tableContainer: {
        marginTop: 16,
    },
    loaderContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    footer: {
        backgroundColor: '#00496F',
        padding: 16,
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    footerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    submitButton: {
        marginTop: 10,
    },
    listContainer: {
        padding: 10,
        backgroundColor: '#00496F',
    },
    expandedContent: {
        width: '100%', // Garante que a View ocupa toda a largura disponível
        // padding: 16,
        alignItems: 'center', // Centraliza os itens horizontalmente
    },
});
