import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

const FlashMessage = ({ message, alertType = '', onClose }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive && message === '') {
            setIsActive(false);
        } else if (!isActive && message !== '') {
            setIsActive(true);
        }
    }, [message]);

    const alertClass = () => {
        switch (alertType) {
            case 'sucesso':
                return styles.success;
            case 'erro':
                return styles.error;
            default:
                return styles.warning;
        }
    };

    const closeMessage = () => {
        setIsActive(false);
        if (onClose) {
            onClose();
        }
    };

    if (!isActive) return null;

    return (
        <View style={[styles.flash, alertClass()]}>
            <Text style={styles.messageText}>{message}</Text>
            <TouchableOpacity onPress={closeMessage} style={styles.closeIcon}>
                <FontAwesomeIcon icon={faTimesCircle} size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    flash: {
        width: Dimensions.get('window').width, // Largura total da tela
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
    error: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
    },
    warning: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeeba',
        borderWidth: 1,
    },
    messageText: {
        flex: 1,
        fontSize: 16,
    },
    closeIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
});

export default FlashMessage;
