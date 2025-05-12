import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import {COLORS, FONTS, SIZES, RH, RW, RPH, RHA} from '../../theme';
import AppText from '../AppText/AppText';

// Get screen width to constrain the table
const SCREEN_WIDTH = Dimensions.get('window').width;

const TableHeader = ({headers, totalWidth}) => {
  return (
    <View style={[styles.headerRow, {width: totalWidth}]}>
      {headers.map((header, index) => (
        <View
          key={index}
          style={[
            styles.headerCell,
            {
              width: header.width,
              flex: header.flex || null,
            },
          ]}>
          <AppText
            size={SIZES.xs}
            fontFamily={FONTS.PR}
            color={COLORS.tableTextLight}
            style={styles.headerText}>
            {header.title}
          </AppText>
        </View>
      ))}
    </View>
  );
};

const TableRow = ({
  item,
  index,
  columns,
  onRowPress,
  onRowLongPress,
  alternateRowColor = true,
  totalWidth,
}) => {
  const isEven = index % 2 === 0;
  const rowBackgroundColor = alternateRowColor
    ? isEven
      ? COLORS.tableRowEvenBg
      : COLORS.tableRowOddBg
    : COLORS.tableRowOddBg;

  return (
    <Pressable
      style={({pressed}) => [
        styles.dataRow,
        {
          backgroundColor: pressed
            ? 'rgba(0, 0, 0, 0.05)'
            : rowBackgroundColor,
          width: totalWidth,
        },
      ]}
      onPress={() => onRowPress && onRowPress(item, index)}
      onLongPress={() => onRowLongPress && onRowLongPress(item, index)}>
      {columns.map((column, columnIndex) => {
        let cellValue = item[column.key];
        // If the value is an object (e.g., hub), display hubName or hubCode
        if (cellValue && typeof cellValue === 'object' && (cellValue.hubName || cellValue.hubCode)) {
          cellValue = cellValue.hubName || cellValue.hubCode || '';
        }
        const isMultiline = cellValue && typeof cellValue === 'string' && cellValue.length > 15;
        
        return (
          <View
            key={columnIndex}
            style={[
              styles.dataCell,
              {
                width: column.width,
                flex: column.flex || null,
                height: isMultiline ? RHA(48) : RHA(30),
              },
            ]}>
            <AppText
              size={column.key === 'id' ? SIZES.xs - 1 : SIZES.xs}
              fontFamily={FONTS.PR}
              color={COLORS.tableTextDark}
              style={styles.dataCellText}
              numberOfLines={2}>
              {cellValue || ''}
            </AppText>
          </View>
        );
      })}
    </Pressable>
  );
};

const TableComponent = ({
  headers = [],
  data = [],
  maxHeight,
  alternateRowColor = true,
  onRowPress,
  onRowLongPress,
  scrollEnabled = true,
  containerWidth,
}) => {
  // Calculate total width based on header widths, constrained by container or screen
  let totalWidth = headers.reduce(
    (acc, header) => acc + (header.width || 0),
    0
  );
  
  // Adjust if the total width exceeds available width
  const availableWidth = containerWidth || SCREEN_WIDTH - RW(40); // Account for screen padding
  
  if (totalWidth > availableWidth) {
    // Scale down proportionally
    const scaleFactor = availableWidth / totalWidth;
    totalWidth = availableWidth;
    
    // Update header widths proportionally
    headers = headers.map(header => ({
      ...header,
      width: Math.floor(header.width * scaleFactor),
    }));
  }

  return (
    <View style={[styles.container, {width: totalWidth}]}>
      <TableHeader headers={headers} totalWidth={totalWidth} />
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <TableRow
            item={item}
            index={index}
            columns={headers}
            onRowPress={onRowPress}
            onRowLongPress={onRowLongPress}
            alternateRowColor={alternateRowColor}
            totalWidth={totalWidth}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={[
          styles.flatList,
          maxHeight ? {maxHeight} : null,
        ]}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RPH(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.tableBorder,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    height: RHA(30),
  },
  headerCell: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: RHA(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
  },
  flatList: {
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
  },
  dataCell: {
    paddingVertical: RHA(6),
    paddingHorizontal: RW(1), // Reduced horizontal padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataCellText: {
    textAlign: 'center',
  },
});

export default TableComponent; 