import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const InputDateTime = ({ value, onChange, error, placeholder = 'Selecione uma data e hora' }) => {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [guardMode, setGuardMode] = useState([]);
    const handleChange = (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
            setShow(false);
            onChange(selectedDate);
            if (!guardMode.includes('time')) {
                showMode('time');
            }
            if (guardMode.includes('date') && guardMode.includes('time')) {
                setGuardMode([]);
            }
        } else {
            setShow(false);
            setGuardMode([]);
        }
    };

    const handleClearDate = () => {
        onChange('');
        setGuardMode([]);
    };

    const showMode = (currentMode) => {
        if (!guardMode.includes(currentMode)) {
            setGuardMode((prevModes) => [...prevModes, currentMode]);
            setShow(true);
            setMode(currentMode);
        }

        if (guardMode.includes('date') && guardMode.includes('time')) {
            setShow(false);
            setGuardMode([]);
        }
    };


    const displayDateTime = value ? `${new Date(value).toLocaleDateString()} ${new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '';

    return (
        <View>
            <TouchableOpacity onPress={() => showMode('date')}>
                <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={displayDateTime}
                        editable={false}
                    />
                    {value && (
                        <TouchableOpacity onPress={handleClearDate}>
                            <Text style={styles.clearText}>Limpar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode={mode}
                    display="default"
                    onChange={handleChange}
                    is24Hour={true}
                />
            )}
        </View>
    );
};

export default InputDateTime;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    inputError: {
        borderColor: 'red',
    },
    clearText: {
        color: 'red',
        marginLeft: 10,
        padding: 2,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
