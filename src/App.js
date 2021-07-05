import './App.css';
import { useState } from 'react';
import { RECIPE_LIST, ID_RECIPE } from './Constants';
var convert = require('xml-js');

function App() {
  const [neededIngredients, setNeededIngredients] = useState({});
  function readFile(e) {
    let file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsText(file);
      reader.onload = () => {
        const xml = reader.result;
        var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
        if (result1) {
          var jsonResult = JSON.parse(result1);
        }
        var recipesCooked = [];
        recipesCooked = jsonResult.SaveGame.player.recipesCooked.item.map(item => item.key.int._text.trim())
          .map(item => ID_RECIPE[item.toString()]);
        var uncookedRecipes = Object.keys(RECIPE_LIST).filter(item => {
          return !recipesCooked.includes(item);
        });

        let neededIngredients = findNeededIngredients(uncookedRecipes);
        setNeededIngredients(neededIngredients);
      }
    }
  }

  function findNeededIngredients(recipeArray) {// take in array of ingredients and map
    let neededIngriedients = {};
    recipeArray.forEach(recipe => {
      let ingredients = Object.keys(RECIPE_LIST[recipe]);
      ingredients.reduce((accum, ingredient) => {
        if (neededIngriedients[ingredient]) {
          neededIngriedients[ingredient] += RECIPE_LIST[recipe][ingredient];
        } else {
          neededIngriedients[ingredient] = RECIPE_LIST[recipe][ingredient];
        }
        return neededIngriedients;
      }, neededIngriedients);
    })
    return neededIngriedients;
  }



  return (
    <div style = {{"margin-left": "20px"}}>
      <h1>Stardew Cooking Ingredients</h1>
      <p>This app checks what ingredients you need to complete all the recipes in a Stardew Valley safe file.</p>
      <p>Choose the save file with your famer's name and an ID number. Default save file location is %AppData%/StardewValley/Saves.</p>
      <input type="file" onChange={readFile}></input>
      <ul style={{ "listStyle": "none" }}>
        {
          Object.keys(neededIngredients).map((item) =>
            <li key={item}>{item}: {neededIngredients[item]}</li>
          )
        }
      </ul>
    </div>
  );
}



export default App;
