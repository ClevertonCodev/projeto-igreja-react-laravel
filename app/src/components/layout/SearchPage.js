import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import api from '../../services/AxiosConfig';
import * as Sharing from 'expo-sharing'

export default function SearchPage({
    error = false,
    goSubmit,
    exportExcel = [],
    loader = false,
    title = null,
    children,
    modelName = null,
    exportingExcel = false,
}) {
    const [isExporting, setIsExporting] = useState(exportingExcel);

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

    return (
        <View style={styles.container}>
            <View style={styles.cardBody}>
                <View>
                    <Button
                        title="Submit"
                        onPress={() => goSubmit(true)}
                    />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { opacity: error ? 1 : 0 }]}>
                        Preencha algum filtro
                    </Text>
                </View>
                <View style={styles.exportButtonContainer}>
                    <Button
                        title="Exportar Excel"
                        onPress={ExcelExport}
                        disabled={isExporting}
                    />
                </View>
                {!loader ? (
                    <View style={styles.tableContainer}>
                        {children}
                    </View>
                ) : (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    titulos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        marginLeft: 8,
        color: '#007BFF',
    },
    cardBody: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
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
});
