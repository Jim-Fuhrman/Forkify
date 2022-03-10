import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if(module.hot) {
  module.hot.accept()
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeView.renderSpinner()

    // 1) loading recipe
    //loadRecipe returns a promise; thus, we need the await keyword in front of it.
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2) rendering the recipe
    recipeView.render(model.state.recipe);
    // The render method could also be written like this:
    // const recipeView = new RecipeView(model.state.recipe)
    
  } catch (err) {
    recipeView.renderError(`${err} 💥💥💥💥`)
  }
}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();
    console.log(resultsView)

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3_ Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    // console.log(`paginationView: ${paginationView}`)
    // console.log(`model.state.search: ${model.state.search}`)
    paginationView.render(model.state.search)
  } catch(err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  // 3_ Render new paginated results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 4) Render new pagination buttons
    // console.log(`paginationView: ${paginationView}`)
    // console.log(`model.state.search: ${model.state.search}`)
    paginationView.render(model.state.search)
  console.log(`goToPage: ${goToPage}`);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings)

  // Update the recipe view
  recipeView.render(model.state.recipe);
}

//the next 4 lines implement the publisher/subscriber pattern.
const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination)
}
init();