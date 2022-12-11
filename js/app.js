import Db from "./aws.js";
import { generateRanksHTML } from "./rankSelect.js";
import { computeEquivalentRanks } from "./calculations.js";
import { resultsHTML } from "./results.js";

let db = new Db();

// Returns the contents of the games table
async function getGames() {
  const games = await db.getTableContents("games");
  return games;
}

// Generate game tile HTML
function generateGameSelectHTML(name, imgLink, id) {
  return `<div class='gameTile' id="${id}" class="gameSelectButton"><img src=${imgLink}><h3>${name}</h3></div>`;
}

// Returns an array of games (not display names)
async function createGamesList() {
  const games = await getGames();
  gamesList = new Array();
  games.Items.map((game) => {
    gamesList.push(game.game.S);
  });
  return gamesList;
}

// Goes through each game tile and removes 'selected' class
function removeSelectedClass(gameTiles) {
  gameTiles.forEach((gameTile) => {
    gameTile.classList.remove("selected");
  });
}

// Deletes all rank html and TODO load skeleton
function reloadRanks() {
  document.querySelector("#rankSelect").innerHTML = "";
  //set skeleton screen
}

function switchToResults() {
  document.querySelector("#content").innerHTML =
    '<div id="selectedRankIconPH" class="skeleton"></div><div id="selectedRankTextPH" class="skeleton-text skeleton"></div><div id="eqRanksPHParent"><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div></div>';
}

function deployResults(resultsHTML) {
  document.querySelector("#content").innerHTML = resultsHTML;
}

async function retrieveGameData(game) {
  let db = new Db();
  let gameData = await db.getTableContents(game.id.S);
  return gameData;
}

async function getAllData(games) {
  let data = {};
  for (const game of games) {
    let gameData = await retrieveGameData(game);
    let gameName = game.id.S;
    data[gameName] = gameData;
  }
  return data;
}

function showResults(resultsHTML) {
  console.log("yay we are here");
}

/**
 * Adds click listeners to each rank tile
 *
 * @param {Element} rankSelect Pass in the element that holds the rank tiles
 */
function addRankEventListeners(rankSelect) {
  let ranks = rankSelect.childNodes;
  ranks.forEach((rank) => {
    rank.addEventListener("click", async (e) => {
      // Happens when a rank tile is clicked
      selectedRank = rank.id;
      removeSelectedClass(ranks);
      // New ranks, so one cant already be selected
      sessionStorage.setItem("isRankSelected", false);
      rank.classList.add("selected");
      console.log("I selected " + selectedRank);
      sessionStorage.setItem("selectedRank", selectedRank);

      // Enable submit button
      document.querySelector("#submitButton").classList.add("enabled");
    });
  });
}

async function main() {
  // SESSION VARIABLES
  sessionStorage.clear();
  sessionStorage.setItem("isGameSelected", false);
  sessionStorage.setItem("isRankSelected", false);
  sessionStorage.setItem("selectedGame", "");
  sessionStorage.setItem("selectedRank", "");

  // List of game ids
  let games = await getGames();
  games = games.Items;

  // Both sections of the first view
  let gameSelect = document.querySelector("#gameSelect");
  let rankSelect = document.querySelector("#rankSelect");

  let gameTiles = [];

  // Create each game tile
  games.forEach((game) => {
    gameTiles.push(
      generateGameSelectHTML(
        game.game.S,
        `/game_icons/${game.img.S}`,
        game.id.S
      )
    );
  });

  // Load HTML into the DOM
  gameSelect.innerHTML = gameTiles.join("");

  // Arrays foreach is what we want
  NodeList.prototype.forEach = Array.prototype.forEach;

  let children = gameSelect.childNodes;

  children.forEach((item) => {
    item.addEventListener("click", async (e) => {
      // Any game may have been already selected, so we need to run through each
      removeSelectedClass(children);
      // Disable the submit button
      document
        .querySelector("#submitButton")
        .classList.replace("enabled", "disabled");
      // Set the session to have the selected game
      sessionStorage.setItem("selectedGame", item.id);
      sessionStorage.setItem("isGameSelected", true);
      // Clear rankSelect and populate with skeleton
      reloadRanks();
      item.classList.add("selected");
      // Build the HTML for the ranks
      let rankHTML = await generateRanksHTML(item.id);
      // Insert the HTML into the DOM
      rankSelect.innerHTML = rankHTML.join("");
      // Now we wait until a rank is selected, or a new game is selected
      // (which will run this function (lambda?) again)
      addRankEventListeners(rankSelect);
    });
  });

  let submitButton = document.querySelector("#submitButton");
  submitButton.addEventListener("click", async (e) => {
    if (
      sessionStorage.getItem("isRankSelected") &&
      sessionStorage.getItem("isRankSelected")
    ) {
      // Switch to results skeleton
      switchToResults();
      // Grab every game id in the database
      let games = await getGames();
      // Use this to grab all the data for each game
      // This uses a lot of resources but is necessary because
      // each rank percentile equivalent needs to be calculated
      const data = await getAllData(games["Items"]);
      // Grab the HTML for the results
      const eqRanks = computeEquivalentRanks(data);
      // Put the results in the session storage
      sessionStorage.setItem("results", eqRanks);
      resultsHTML = resultsHTML(eqRanks, data);
      deployResults(resultsHTML);
    }
  });
}

main();
