import { createStore, combineReducers } from "redux";
import { UserReducer } from "./Reducers/reducers";

const rootReducer = combineReducers({
  User: UserReducer
});
 
export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore():any {
  const store = createStore(
    rootReducer,
  );
  return store;
} 
 