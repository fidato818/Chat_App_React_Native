import {createSlice, current} from '@reduxjs/toolkit';

const initialState = {
  value: [],
  yearStore: null,
  yearCouncil: null,
  state: {user: '', userProfile: ''},
  isThemeDark: false,

  user: '',
  isLogin: '',
};

export const userSlice = createSlice({
  name: 'User_to_Redux',
  initialState,
  reducers: {
    // toggleTheme: (state, action) => {
    //   console.log('action', action);
    //   return {...state, isThemeDark: action.payload};
    // },
    toggleOn: (state = initialState) => {
      state.isThemeDark = true;
    },
    toggleOff: (state = initialState) => {
      state.isThemeDark = false;
    },
    update_user: (state, action) => {
      return {...state, user: action.payload};
    },
    remove_user: state => {
      return {...state, user: ''};
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggleOn, toggleOff, update_user, remove_user} =
  userSlice.actions;

export default userSlice.reducer;
