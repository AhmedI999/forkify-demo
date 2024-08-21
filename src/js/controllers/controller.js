import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from '../models/model.js';
import recipeView from "../views/recipeView.js";
import searchView from "../views/searchView";
import resultsView from "../views/resultsView";
import paginationView from "../views/paginationView";
import bookmarksView from "../views/bookmarksView";
import AddRecipeView from "../views/addRecipeView";
import addRecipeView from "../views/addRecipeView";
import {MODAL_CLOSE_SEC} from "../config/config";

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
///////////////////////////////////////

  // Rendering recipe on screen
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // update results to mark the selected one
    resultsView.update(model.getSearchResultsPage());
    // rendering spinner
    recipeView.renderSpinner();
    // loading recipe
    await model.loadRecipe(id);
    // rendering recipe
    recipeView.render(model.state.recipe);
    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings ( in state )
  model.updateServings(newServings);
  // Update the recipe view
    // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// In order for add recipe window to show
  // it is imported

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    // Upload data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleAddWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error(`User error ${err}`);
    addRecipeView.renderError(err.message);
  }

};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();


