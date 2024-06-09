import { Provider } from 'react-redux';
import store from "../redux/store";
import Home from '../pages/Home';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}