import React from 'react';
import { View, StyleSheet } from 'react-native';
import WordList from './Word';

export default function App() {
    return (
        <View style={styles.container}>
            <WordList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
