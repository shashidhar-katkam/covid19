import * as React from "react";
import UserApp from './components/user/index';
import { initializeIcons } from '@uifabric/icons';
import { Provider } from 'react-redux';
import socketIOClient from 'socket.io-client';
import configureStore from "./Redux/app.store";
import { BrowserRouter } from 'react-router-dom';
import './styles.scss';
const ENDPOINT = "/";
export const store = configureStore();
export const socket = socketIOClient(ENDPOINT);
initializeIcons();

class App extends React.Component {

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <UserApp />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;


