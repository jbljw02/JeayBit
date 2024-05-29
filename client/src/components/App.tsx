import { Provider } from 'react-redux';
import store from "../redux/store";
import Home from '../pages/Home';

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}