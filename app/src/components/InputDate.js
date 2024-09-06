import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const InputDate = ({ value, onChange, error, placeholder = 'Selecione uma data' }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setShow(false);
      onChange(selectedDate);
    } else {
      setShow(false);
    }
  };

  const handleClearDate = () => {
    onChange('');
  };

  const displayDate = value ? new Date(value).toLocaleDateString() : '';

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={displayDate}
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
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default InputDate;

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
    width: 350,
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
});
