import './App.css';
import DrawerAppBar from './components/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import Products from './components/products/products';
import Home from './components/home/home';
import Customers from './components/customers/customers';
import Customer from './components/customer/customer';
function App() {
  return (
    <div className="App">
      <DrawerAppBar></DrawerAppBar>
      <Routes>
        <Route path="/" element = {<Home/>}></Route>
        <Route path="/products" element = {<Products/>}></Route>
        <Route path="/customers" element = {<Customers/>}></Route>
        <Route path='/customers/:id' element={<Customer/>} />
      </Routes>
    </div>
  );
}

export default App;
