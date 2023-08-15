import React, { useState, useEffect } from "react";
import { FlatList, Text, View, Button, StyleSheet, Animated, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";

function WordList() {
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [shuffleCounter, setShuffleCounter] = useState(0);
  const spinValue = new Animated.Value(0);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`https://api.datamuse.com/words?sp=?*&max=1000&refresh=${refreshCounter}`);
      const updatedWordList = response.data.map((word) => {
        const firstLetter = word.word.charAt(0).toUpperCase();
        const restOfWord = word.word.slice(1);
        const modifiedWord = firstLetter + restOfWord;
        return { ...word, word: modifiedWord };
      });
      setWordList(updatedWordList);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [refreshCounter]);

  useEffect(() => {
    if (shuffleCounter > 0) {
      shuffleWords();
    }
  }, [shuffleCounter]);

  const renderWordItem = ({ item }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.word}</Text>
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    animateButtonRotation();
    setRefreshCounter((prevCounter) => prevCounter + 1);
  };

  const handleShuffle = () => {
    setShuffleCounter((prevCounter) => prevCounter + 1);
  };

  const animateButtonRotation = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const shuffleWords = () => {
    const shuffledList = [...wordList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    setWordList(shuffledList);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Button
        title="Refresh"
        onPress={handleRefresh}
        disabled={refreshing}
        style={{ transform: [{ rotate: spin }] }}
        color="#007AFF"
      />
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={wordList}
          renderItem={renderWordItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      <TouchableOpacity onPress={handleShuffle} style={styles.shuffleButton}>
        <Text style={styles.shuffleButtonText}>Shuffle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F4F4F4",
  },
  wordItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 16,
    color: "#333",
  },
  loader: {
    marginVertical: 20,
  },
  shuffleButton: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  shuffleButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default WordList;