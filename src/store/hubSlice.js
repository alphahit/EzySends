import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHubDataFromFirestore, saveHubDataToFirestore } from '../firebase/firebaseFunctions';

// Thunk to fetch all hubs from Firestore
export const fetchHubs = createAsyncThunk('hub/fetchHubs', async (_, thunkAPI) => {
  try {
    const hubs = await getHubDataFromFirestore();
    return hubs;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// Thunk to add a new hub to Firestore and state
export const addHub = createAsyncThunk('hub/addHub', async (hubData, thunkAPI) => {
  try {
    await saveHubDataToFirestore(hubData);
    // After adding, fetch the latest hub list
    const hubs = await getHubDataFromFirestore();
    return hubs;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const hubSlice = createSlice({
  name: 'hub',
  initialState: {
    hubs: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHubs.fulfilled, (state, action) => {
        state.loading = false;
        state.hubs = action.payload;
      })
      .addCase(fetchHubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addHub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHub.fulfilled, (state, action) => {
        state.loading = false;
        state.hubs = action.payload;
      })
      .addCase(addHub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hubSlice.reducer;
