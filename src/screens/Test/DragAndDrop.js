import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import PlusWhite from '../../assets/svg/plusWhite.svg';  // your SVG

export default function DragAndDrop() {
  const [data, setData] = useState([
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
    { id: '4', text: 'Item 4' },
  ]);

  const renderItem = ({ item, index, drag, isActive }) => (
    <View
      style={[
        styles.item,
        index % 2 === 0 ? styles.itemEven : styles.itemOdd,
        isActive && styles.activeItem,
      ]}
    >
      <Text style={styles.itemText}>{item.text}</Text>

      {/* Tap this icon to pick up & drag */}
      <TouchableOpacity
        onPressIn={drag}
        disabled={isActive}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <PlusWhite width={24} height={24} />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Drag and Drop List</Text>
      <Text style={styles.subHeader}>
        Tap the “+” icon to drag an item
      </Text>

      <DraggableFlatList
        data={data}
        onDragEnd={({ data: newData }) => setData(newData)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        containerStyle={styles.list}
        /* no activationDistance needed */
      />

      <View style={styles.instructions}>
        <Text style={styles.instrText}>1. Tap the + icon</Text>
        <Text style={styles.instrText}>2. Drag it to the new position</Text>
        <Text style={styles.instrText}>3. Release to drop</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'pink', padding: 16 },
  header:    { fontSize: 24, color: 'black', marginBottom: 8 },
  subHeader: { fontSize: 14, color: 'grey', marginBottom: 16 },

  list: { flexGrow: 0, paddingBottom: 20 },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    height: 70,
  },
  itemEven: { backgroundColor: 'white' },
  itemOdd:  { backgroundColor: 'lightgrey' },
  activeItem: {
    backgroundColor: 'darkgrey',
    elevation: 5,
    borderWidth: 2,
    borderColor: 'grey',
  },

  itemText: { fontSize: 16, color: 'black' },

  instructions:     { backgroundColor: 'white', borderRadius: 8, padding: 16, marginTop: 20 },
  instrText:        { fontSize: 14, color: 'black', marginBottom: 4 },
});
