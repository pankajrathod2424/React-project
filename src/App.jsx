import { useState } from 'react'
import './App.css'
import ToDos from './components/ToDos'
import 'bootstrap/dist/css/bootstrap.min.css';
import Recipes from './components/Recipes';

function App() {

  return (
    <>
    <Recipes />
      <ToDos />
    </>
  )
}

export default App