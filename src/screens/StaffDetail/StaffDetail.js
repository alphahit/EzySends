import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Back from '../../assets/svg/back.svg';
import Calendar from '../../assets/svg/calendar.svg';
import Cancel from '../../assets/svg/cancel.svg';
import Delete from '../../assets/svg/delete.svg';
import Edit from '../../assets/svg/edit.svg';
import Plus from '../../assets/svg/plus.svg';
import Profile from '../../assets/svg/profile.svg';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppText from '../../components/AppText/AppText';
import DateRangeButtons from '../../components/DateRangeButtons/DateRangeButtons';
import FilterButton from '../../components/FilterButton';
import TableComponent from '../../components/TableComponent';
import TwoButtons from '../../components/TwoButtons/TwoButtons';
import { COLORS, FONTS, RH, RHA, RPH, RW, SIZES } from '../../theme';
// Get screen width for calculations
const SCREEN_WIDTH = Dimensions.get('window').width;

const StaffDetail = ({navigation, route}) => {
  // Get staff ID and data from route params
  const {staffId, staffData} = route.params || {};
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - RW(40)); // Account for screen padding
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [advanceDate, setAdvanceDate] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showAdvancePicker, setShowAdvancePicker] = useState(false);

  const [showLongPressModal, setShowLongPressModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFwd, setEditFwd] = useState('');
  const [editRvp, setEditRvp] = useState('');
  const [editAdvance, setEditAdvance] = useState('');

  const [showLossModal, setShowLossModal] = useState(false);
  const [lossAmount, setLossAmount] = useState('');

  // --- DUMMY DATA REMOVED ---
  // Table data will be managed elsewhere; here we assume it comes from props or state.
  // For now, let's assume a placeholder for tableRows as an empty array.
  const [tableRows, setTableRows] = useState([]); // TODO: Replace with actual data fetching logic

  // Filtering logic based on date range
  function isWithinRange(dateStr) {
    if (!start && !end) return true;
    const [dd, mm, yyyy] = dateStr.split('-');
    const date = new Date(`${yyyy}-${mm}-${dd}`);
    let startDate = start ? new Date(start.split('-').reverse().join('-')) : null;
    let endDate = end ? new Date(end.split('-').reverse().join('-')) : null;
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  }
  const filteredRows = tableRows.filter(row => isWithinRange(row.date));

  // Calculation logic
  const sumFwd = filteredRows.reduce((sum, row) => sum + (parseInt(row.fwd) || 0), 0);
  const sumRvp = filteredRows.reduce((sum, row) => sum + (parseInt(row.rvp) || 0), 0);
  const sumAdvance = filteredRows.reduce((sum, row) => sum + (parseInt((row.advance || '').replace('₹', '')) || 0), 0);
  const sumLoss = filteredRows.reduce((sum, row) => sum + (parseInt((row.loss || '').replace('₹', '')) || 0), 0);
  const payout = (sumFwd * 13) + (sumRvp * 13);
  const tds = Math.round(payout * 0.01);
  const total = payout - tds - sumAdvance;

  // For the footer
  const footerData = {
    fwd: sumFwd,
    rvp: sumRvp,
    advance: sumAdvance,
    loss: sumLoss,
    tds: tds,
    finalPayout: total,
  };

  // Calculate appropriate column widths based on available space
  const getColumnWidths = availableWidth => {
    // Proportions derived from the original RPH() values (29, 79, 39, 37, 62.33, 74, 50.67)
    const idProp = 29;
    const dateProp = 79;
    const fwdProp = 39;
    const rvpProp = 37;
    const advanceProp = 62.33;
    const totalProp = 74;
    const tdsProp = 50.67;

    // Calculate the total sum of these proportions
    const totalProportionUnits =
      idProp + dateProp + fwdProp + rvpProp + advanceProp + totalProp + tdsProp;

    // Distribute the available width based on the calculated percentages
    return {
      id: Math.floor(availableWidth * (idProp / totalProportionUnits)),
      date: Math.floor(availableWidth * (dateProp / totalProportionUnits)),
      fwd: Math.floor(availableWidth * (fwdProp / totalProportionUnits)),
      rvp: Math.floor(availableWidth * (rvpProp / totalProportionUnits)),
      advance: Math.floor(
        availableWidth * (advanceProp / totalProportionUnits),
      ),
      total: Math.floor(availableWidth * (totalProp / totalProportionUnits)),
      tds: Math.floor(availableWidth * (tdsProp / totalProportionUnits)),
    };
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setAdvanceDate('');
    setAdvanceAmount('');
    setShowModal(false);
  };
  const saveAdvance = () => {
    console.log('Add Advance', {date: advanceDate, amount: advanceAmount});
    closeModal();
  };
  // Get column widths based on container width
  const columnWidths = getColumnWidths(containerWidth);

  // Table headers using the calculated proportional column widths
  const headers = [
    {title: '#', key: 'id', width: columnWidths.id},
    {title: 'Date', key: 'date', width: columnWidths.date},
    {title: 'FWD', key: 'fwd', width: columnWidths.fwd},
    {title: 'RVP', key: 'rvp', width: columnWidths.rvp},
    {title: 'Advance', key: 'advance', width: columnWidths.advance},
    {title: 'Total', key: 'total', width: columnWidths.total},
    {title: 'TDS', key: 'tds', width: columnWidths.tds},
  ];

  const tableData = [
    {
      id: '1',
      date: '01-02-25',
      fwd: '15',
      rvp: '14',
      advance: '₹300',
      total: '₹3000',
      tds: '₹30',
    },
    {
      id: '2',
      date: '02-02-25',
      fwd: '20',
      rvp: '18',
      advance: '₹500',
      total: '₹4000',
      tds: '₹40',
    },
    // add more rows as needed
  ];
  const handleRowPress = (rowData, index) => {
    console.log('Row pressed:', rowData);
    // TBD
  };

  const handleRowLongPress = (rowData, index) => {
    setSelectedRow(rowData);
    setShowLongPressModal(true);
  };

  const handleEdit = () => {
    // Set initial values from selected row
    if (selectedRow) {
      setEditFwd(selectedRow.fwd || '');
      setEditRvp(selectedRow.rvp || '');
      setEditAdvance((selectedRow.advance || '').replace('₹', ''));
    }
    setShowLongPressModal(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    console.log('Delete pressed for', selectedRow);
    setShowLongPressModal(false);
  };

  const handleCancel = () => {
    setShowLongPressModal(false);
  };

  const saveTransaction = () => {
    console.log('Save transaction', {
      fwd: editFwd,
      rvp: editRvp,
      advance: editAdvance,
    });
    setShowEditModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Handle container size changes
  const handleLayoutChange = event => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleProfilePress = () => {
    navigation.navigate('AddStaff', {
      mode: 'view',
      editData: {
        ...staffData,
        // Include all the new fields
        hub: staffData.hub || '',
        beneficiaryName: staffData.beneficiaryName || '',
        accountNumber: staffData.accountNumber || '',
        ifsc: staffData.ifsc || '',
        bankName: staffData.bankName || '',
        accountUsername: staffData.accountUsername || '',
        accountPassword: staffData.accountPassword || '',
        isAccountActive: staffData.isAccountActive || false,
        perFwd: staffData.perFwd || '',
        perRvp: staffData.perRvp || '',
      },
    });
  };

  const iconSize = RPH(24);


  const pickStart = async () => {
    // e.g. open a date picker...
    // const chosen = await showDatePicker();
    // setStart(chosen.format('DD/MM/YYYY'));

    setShowStartPicker(true);
  };

  const pickEnd = async () => {
    // const chosen = await showDatePicker();
    // setEnd(chosen.format('DD/MM/YYYY'));
    setShowEndPicker(true);
  };

  const openLossModal = () => {
    setShowLossModal(true);
  };

  const closeLossModal = () => {
    setShowLossModal(false);
    setLossAmount('');
  };

  const saveLoss = () => {
    console.log('Save loss', {amount: lossAmount});
    closeLossModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={staffData.name}
        leftIcon={
          <View style={styles.iconContainer}>
            <Back
              width={iconSize}
              height={iconSize}
              fill={COLORS.tableTextDark}
            />
          </View>
        }
        onPressLeft={handleBackPress}
        rightIcon={
          <View style={styles.iconContainer}>
            <Profile
              width={iconSize}
              height={iconSize}
              fill={COLORS.tableTextDark}
            />
          </View>
        }
        onPressRight={handleProfilePress}
      />

      <View style={styles.filterContainer}>
        <View>
          <DateRangeButtons
            startDate={start}
            endDate={end}
            onSelectStart={pickStart}
            onSelectEnd={pickEnd}
          />
          <View style={styles.fwdRvpContainer}>
            <AppText style={styles.fwdRvpText}>
              FWD-{staffData?.perFwd || '₹13'} RVP-{staffData?.perRvp || '₹13'}
            </AppText>
          </View>
        </View>

        

        <View style={styles.filterButtonsContainer}>
          <FilterButton />

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={openLossModal}
              style={styles.actionButton}>
              <Plus
                width={iconSize}
                height={iconSize}
                fill={COLORS.tableTextDark}
              />
              <AppText style={styles.actionButtonText}>Loss</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openModal}
              style={[styles.actionButton, styles.advanceButton]}>
              <Plus
                width={iconSize}
                height={iconSize}
                fill={COLORS.tableTextDark}
              />
              <AppText style={styles.actionButtonText}>Advance</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tableContainer} onLayout={handleLayoutChange}>
          <TableComponent
            headers={headers}
            data={tableData}
            onRowPress={handleRowPress}
            onRowLongPress={handleRowLongPress}
            scrollEnabled={false} // Disable scrolling within the table
            containerWidth={containerWidth}
          />
        </View>
      </ScrollView>

      {/* Footer Component */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {/* Left Column */}
          <View style={styles.footerColumn}>
            <AppText
              fontFamily={FONTS.PR}
              size={SIZES.xs}
              color={COLORS.whiteText}
              style={styles.footerText}>
              FWD - {footerData.fwd}
            </AppText>
            <AppText
              fontFamily={FONTS.PR}
              size={SIZES.xs}
              color={COLORS.whiteText}
              style={styles.footerText}>
              RVP - {footerData.rvp}
            </AppText>
          </View>

          {/* Middle Column */}
          <View style={styles.footerColumn}>
            <AppText
              fontFamily={FONTS.PR}
              size={SIZES.xs}
              color={COLORS.whiteText}
              style={[styles.footerText, styles.textCenter]}>
              Advance - ₹{footerData.advance}
            </AppText>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppText
                fontFamily={FONTS.PR}
                size={SIZES.xs}
                color={COLORS.whiteText}
                style={[styles.textCenter]}>
                Loss - ₹{footerData.loss}
              </AppText>

              <AppText
                fontFamily={FONTS.PR}
                size={SIZES.xs}
                color={COLORS.whiteText}
                style={[styles.textCenter, {marginLeft: RPH(5)}]}>
                TDS - ₹{footerData.tds}
              </AppText>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.footerColumn}>
            <AppText
              fontFamily={FONTS.PR}
              size={SIZES.xs}
              color={COLORS.whiteText}
              style={[styles.footerText, styles.textRight]}>
              Final Payout
            </AppText>
            <AppText
              fontFamily={FONTS.PB}
              size={SIZES.xs}
              color={COLORS.whiteText}
              style={[styles.footerText, styles.textRight]}>
              ₹{footerData.finalPayout}
            </AppText>
          </View>
        </View>
      </View>

      {/* Add Advance Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => setShowAdvancePicker(true)}>
                    <Text style={styles.textInput}>
                      {advanceDate
                        ? advanceDate.toLocaleDateString()
                        : 'Add date'}
                    </Text>
                    <Calendar width={24} height={24} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputCol, {flex: 1}]}>
                  <Text style={styles.inputLabel}>Amount</Text>
                  <View style={styles.inputField}>
                    <TextInput
                      value={advanceAmount}
                      onChangeText={setAdvanceAmount}
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.primaryBtn]}
                  onPress={saveAdvance}>
                  <Text style={styles.modalBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.secondaryBtn]}
                  onPress={closeModal}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={showStartPicker}
        date={start || new Date()}
        mode="date"
        onConfirm={date => {
          setShowStartPicker(false);
          setStart(date);
        }}
        onCancel={() => setShowStartPicker(false)}
      />
      <DatePicker
        modal
        open={showEndPicker}
        date={end || new Date()}
        mode="date"
        onConfirm={date => {
          setShowEndPicker(false);
          setEnd(date);
        }}
        onCancel={() => setShowEndPicker(false)}
      />
      <DatePicker
        modal
        open={showAdvancePicker}
        date={advanceDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowAdvancePicker(false);
          setAdvanceDate(date);
        }}
        onCancel={() => setShowAdvancePicker(false)}
      />

      {/* Long Press Modal */}
      <Modal
        visible={showLongPressModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.longPressModal}>
            <View style={styles.longPressModalContent}>
              <TouchableOpacity
                style={styles.longPressOption}
                onPress={handleEdit}>
                <Edit width={24} height={24} />
                <Text style={styles.longPressOptionText}>Edit Transaction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.longPressOption}
                onPress={handleDelete}>
                <Delete width={24} height={24} />
                <Text style={styles.longPressOptionText}>
                  Delete Transaction
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.longPressOption}
                onPress={handleCancel}>
                <Cancel width={24} height={24} />
                <Text style={styles.longPressOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalContent}>
              <View style={styles.inputRowEdit}>
                <View style={styles.inputColEdit}>
                  <Text style={styles.inputLabelEdit}>FWD</Text>
                  <View style={styles.inputFieldEdit}>
                    <TextInput
                      value={editFwd}
                      onChangeText={setEditFwd}
                      keyboardType="numeric"
                      style={styles.textInputEdit}
                    />
                  </View>
                </View>

                <View style={styles.inputColEdit}>
                  <Text style={styles.inputLabelEdit}>RVP</Text>
                  <View style={styles.inputFieldEdit}>
                    <TextInput
                      value={editRvp}
                      onChangeText={setEditRvp}
                      keyboardType="numeric"
                      style={styles.textInputEdit}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fullInputCol}>
                <Text style={styles.inputLabelEdit}>Advance Amount</Text>
                <View style={styles.inputFieldEdit}>
                  <TextInput
                    value={editAdvance}
                    onChangeText={setEditAdvance}
                    keyboardType="numeric"
                    style={styles.textInputEdit}
                  />
                </View>
              </View>

              <TwoButtons
                primary={{
                  title: 'SAVE',
                  onPress: saveTransaction,
                  backgroundColor: '#274940',
                }}
                secondary={{
                  title: 'CANCEL',
                  onPress: closeEditModal,
                  backgroundColor: '#C5C5C5',
                }}
                // buttonWidth="45%"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Loss Modal */}
      <Modal
        visible={showLossModal}
        transparent
        animationType="fade"
        onRequestClose={closeLossModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.lossModal}>
            <View style={styles.lossModalContent}>
              <View style={styles.lossInputContainer}>
                <Text style={styles.lossInputLabel}>Loss Amount</Text>
                <View style={styles.lossInputField}>
                  <TextInput
                    value={lossAmount}
                    onChangeText={setLossAmount}
                    keyboardType="numeric"
                    style={styles.lossTextInput}
                  />
                </View>
              </View>

              <TwoButtons
                primary={{
                  title: 'SAVE',
                  onPress: saveLoss,
                  backgroundColor: '#274940',
                }}
                secondary={{
                  title: 'CANCEL',
                  onPress: closeLossModal,
                  backgroundColor: '#C5C5C5',
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackgroundColor,
  },
  scrollContent: {
    flexGrow: 1,
    padding: RW(20),
    paddingBottom: RH(100), // Add padding to avoid content being hidden by footer
  },
  headerContainer: {
    marginBottom: RH(25),
  },
  headerTitle: {
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
  },
  // Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: RH(80),
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContent: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RW(10),
  },
  footerColumn: {
    width: '33%',
    height: RH(39),
    justifyContent: 'center',
    alignItems: 'center',
    gap: RH(3),
  },
  footerText: {
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  iconContainer: {
    backgroundColor: COLORS.primaryColor,
    width: RPH(40),
    height: RPH(40),
    borderRadius: RPH(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  fwdRvpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RHA(11),
    width: RPH(123),
    height: RHA(28),
    backgroundColor: '#E9FAF6',
    justifyContent: 'center',
  },
  fwdRvpText: {
    height: RHA(18),
    fontFamily: FONTS.PR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: RHA(12),
    lineHeight: RHA(18),
    color: '#000000',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: RPH(356),
    height: RHA(197),
    backgroundColor: '#FFF',
    paddingVertical: RHA(25),
    paddingHorizontal: RPH(22),
    flexDirection: 'row',
  },
  modalInner: {flex: 1, justifyContent: 'space-between'},
  inputRow: {flexDirection: 'row', gap: RPH(25), height: RHA(79)},
  inputCol: {width: RPH(160), gap: RHA(10)},
  inputLabel: {
    fontFamily: 'Poppins',
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RPH(10),
    height: RHA(42),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    position: 'relative',
  },
  textInput: {flex: 1, fontSize: RHA(16), lineHeight: RHA(24), color: '#888'},

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: RHA(43),
  },
  modalBtn: {
    width: RPH(142),
    height: RHA(43),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RPH(10),
  },
  primaryBtn: {backgroundColor: '#274940'},
  secondaryBtn: {backgroundColor: '#C5C5C5'},
  modalBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: RHA(16),
    textTransform: 'uppercase',
  },
  longPressModal: {
    width: RPH(356),
    height: RHA(170),
    backgroundColor: '#FFFFFF',
    padding: RPH(25),
    paddingHorizontal: RPH(22),
    gap: RHA(10),
  },
  longPressModalContent: {
    flex: 1,
    gap: RHA(6),
  },
  longPressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RHA(6),
    paddingHorizontal: RPH(15),
    gap: RPH(4),
    width: '100%',
    height: RHA(36),
    backgroundColor: '#E9FAF6',
  },
  longPressOptionText: {
    fontFamily: 'Poppins',
    fontSize: RHA(16),
    lineHeight: RHA(24),
    color: '#282828',
  },
  // Edit Modal Styles
  editModal: {
    width: RPH(356),
    height: RHA(301),
    backgroundColor: '#FFFFFF',
    padding: RPH(25),
    paddingHorizontal: RPH(22),
    gap: RHA(10),
  },
  editModalContent: {
    flex: 1,
    gap: RHA(25),
  },
  inputRowEdit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: RPH(25),
    width: '100%',
    height: RHA(79),
  },
  inputColEdit: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: RHA(10),
    width: RPH(143.5),
    height: RHA(79),
  },
  fullInputCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: RHA(10),
    width: '100%',
    height: RHA(79),
  },
  inputLabelEdit: {
    fontFamily: 'Poppins',
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000000',
  },
  inputFieldEdit: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: RPH(10),
    width: '100%',
    height: RHA(42),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
  },
  textInputEdit: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: RHA(16),
    lineHeight: RHA(24),
    color: '#282828',
  },

  // Filter and Action Buttons Styles
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: RPH(24),
    marginTop: RHA(20),
  },
  filterButtonsContainer: {
    alignItems: 'flex-end',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RHA(11),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: RPH(5),
  },
  advanceButton: {
    marginLeft: RPH(12),
  },

  // Loss Modal Styles
  lossModal: {
    width: RPH(356),
    height: RHA(197),
    backgroundColor: '#FFFFFF',
    padding: RPH(25),
    paddingHorizontal: RPH(22),
    gap: RHA(10),
  },
  lossModalContent: {
    flex: 1,
    gap: RHA(25),
  },
  lossInputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: RHA(10),
    width: '100%',
    height: RHA(79),
  },
  lossInputLabel: {
    fontFamily: 'Poppins',
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000000',
  },
  lossInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RHA(9),
    paddingHorizontal: RPH(10),
    width: '100%',
    height: RHA(42),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
  },
  lossTextInput: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: RHA(16),
    lineHeight: RHA(24),
    color: '#282828',
  },

  bankDetailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: RHA(15),
    borderRadius: 8,
    marginTop: RHA(20),
    marginHorizontal: RPH(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: FONTS.PB,
    fontSize: RHA(18),
    color: COLORS.tableTextDark,
    marginBottom: RHA(10),
  },
  bankInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RHA(5),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  bankLabel: {
    fontFamily: FONTS.PR,
    fontSize: RHA(14),
    color: COLORS.tableTextDark,
  },
  bankValue: {
    fontFamily: FONTS.PM,
    fontSize: RHA(14),
    color: COLORS.tableTextDark,
  },
});

export default StaffDetail;
