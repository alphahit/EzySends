// Helper to fetch and calculate accumulated salary for each employee
import { getFirestore, collection, query, where, onSnapshot } from '@react-native-firebase/firestore';

/**
 * Fetches all salary transactions for a given employee and calculates the total unpaid salary.
 * @param {string} employeeId
 * @param {function} callback (accumulatedSalary: number) => void
 * @returns {function} unsubscribe
 */
export function listenAccumulatedSalary(employeeId, callback) {
  const db = getFirestore();
  const transactionsRef = collection(db, 'transactions');
  const q = query(transactionsRef, where('employeeId', '==', employeeId), where('type', '==', 'Salary'));
  return onSnapshot(q, snapshot => {
    let accumulated = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      // Only add if not paid
      if (!data.paid) {
        accumulated += Number(data.amount) || 0;
      }
    });
    callback(accumulated);
  });
}

/**
 * Fetches all salary transactions for a given employee and calculates the total paid salary.
 * @param {string} employeeId
 * @param {function} callback (paidSalary: number) => void
 * @returns {function} unsubscribe
 */
export function listenPaidSalary(employeeId, callback) {
  const db = getFirestore();
  const transactionsRef = collection(db, 'transactions');
  const q = query(transactionsRef, where('employeeId', '==', employeeId), where('type', '==', 'Salary'), where('paid', '==', true));
  return onSnapshot(q, snapshot => {
    let paid = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      paid += Number(data.amount) || 0;
    });
    callback(paid);
  });
}
