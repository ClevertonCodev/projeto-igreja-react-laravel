import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const renderOptions = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                Math.abs(i - currentPage) <= 2
            ) {
                pages.push(
                    <TouchableOpacity
                        key={i}
                        style={[styles.pageItem, i === currentPage && styles.active]}
                        onPress={() => onPageChange(i)}
                    >
                        <Text style={[styles.pageText, i === currentPage && styles.textActive]}>{i}</Text>
                    </TouchableOpacity>
                );
            } else if (Math.abs(i - currentPage) === 3) {
                pages.push(
                    <Text key={i} style={styles.pageText}>...</Text>
                );
            }
        }
        return pages;
    };

    return (
        <View style={styles.paginationContainer}>
            <TouchableOpacity
                style={styles.pageItem}
                onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Text style={styles.pageText}>{'<'}</Text>
            </TouchableOpacity>

            {renderOptions()}

            <TouchableOpacity
                style={styles.pageItem}
                onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Text style={styles.pageText}>{'>'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    pageItem: {
        borderWidth: 1,
        borderColor: '#00496F',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    active: {
        backgroundColor: '#00496F',
    },
    pageText: {
        color: '#00496F',
    },
    textActive: {
        color: '#FFF',
    },
});
