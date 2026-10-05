import { useState } from 'react'
import Search from './components/Search'
import FoodList from './components/FoodList'
import FoodDetail from './components/FoodDetail'
import Nav from './components/Nav'
import Container from './components/Container'
import InnerContainer from './components/InnerContainer'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [foodData, setFoodData] = useState([]);
  const [foodId, setFoodId] = useState("");

  return (
    <div className="App">
      <Nav />
      <Search setFoodData={setFoodData} />
      <Container>
        <InnerContainer> 
          <FoodList setFoodId={setFoodId} foodData={foodData} setFoodData={setFoodData} />
        </InnerContainer> 
        <InnerContainer>
          <FoodDetail foodId={foodId} />
        </InnerContainer>
      </Container>          
    </div>
  )
}

export default App
