import {combineReducers} from 'redux';
import {AsyncStorage} from 'react-native'
import {Reducer} from 'react-native-router-flux';
import { ActionConst } from 'react-native-router-flux';
import {auth, login, signup, token}from "./login";
import {feed, events, dateReducer, eventForms} from './events';



// router reducer
export function routerReducer(params) {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
}
// changes name of header when scene changes
const header = (state = {title: 'DASHBOARD'}, action) => {
  switch (action.type) {
  case ActionConst.PUSH :
    return { ...state,
      title: action.title ? action.title.toUpperCase() : action.key.toUpperCase()
    }
  case ActionConst.BACK_ACTION :
    return {...state,
      title: 'DASHBOARD'
    }
  default:
    return state;
  }
};


const groups = (state = {id: null, groups: [], users: [], groupName: null, members: []}, action) => {
  switch(action.type) {
  case 'CURRENT_GROUP':
    return{...state,
      id: action.id
  }
  case 'UPDATE_GROUPS':
    return{...state,
      groups: action.data,
      id: action.data.length > 0 ? action.data[0].id : 0

  }
  case 'RECEIVE_USERS' :
    return {...state,
      users: action.users
  }
  case 'ADD_NAME' :
    return {...state,
      groupName: action.text
  }
  case 'ADD_MEMBER' :
    if (state.members.includes(action.id)) {
      var updated = [...state.members].filter(id => id !== action.id);
      console.log('remove members ---->', updated);
      return {...state,
        members: updated
      }
    } else {
      console.log('added id ---->', action.id);
      return {...state,
        members: [...state.members, action.id]
      }
    }
  case 'REMOVE_MEMBER' :
    var userId = action.id;
    var updatedMembers = state.users.filter(user => user.id !== userId);
    return {...state,
      users: [...updatedMembers]
    }
  default:
    return state;
  }
}
export default combineReducers({
  auth,
  header,
  groups,
  events,
  dateReducer,
  login,
  signup,
  token,
  feed,
  eventForms,
  // more reducers
});
