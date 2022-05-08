import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import App, { UPDATE_USER, USER_FETCHED } from './App';


const baseState = {
  user: {
    name: 'John',
    surname: 'Doe',
    age: '25',
  },
}

const store = createStore(userReducer)

ReactDOM.render(
  <React.StrictMode>
    <h1>Watch for passing whole objects as props! Here's why:</h1>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

function userReducer(state = baseState, action) {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          [action.payload.field]: action.payload.value,
        },
      };
    }
    case USER_FETCHED: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        }
      }
    }
    default: {
      return state;
    }
  }
}
