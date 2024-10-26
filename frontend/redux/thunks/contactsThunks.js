import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchContactsApi } from "../../api/contactsApi";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchContactsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
