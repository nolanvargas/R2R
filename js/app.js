import Db from "./aws.js";
import { generateGameSelectHTML } from "./gameSelect.js";
import { generateRanksHTML } from "./rankSelect.js";

let db = new Db();

async function getGames() {
  const games = await db.getTableContents("games");
  return games;
}

async function createGamesList() {
  const games = await getGames();
  gamesList = new Array();
  games.Items.map((game) => {
    gamesList.push(game.game.S);
  });
  return gamesList;
}

function removeSelectedClass(gameTiles) {
  gameTiles.forEach((gameTile) => {
    gameTile.classList.remove("selected");
  });
}

async function main() {
  let gamesList = await createGamesList();
  let games = await getGames();
  games = games.Items;
  let gameSelect = document.querySelector("#gameSelect");
  let gameTiles = [];

  games.forEach((game) => {
    gameTiles.push(
      generateGameSelectHTML(
        game.game.S,
        `/game_icons/${game.img.S}`,
        game.id.S
      )
    );
  });
  gameSelect.innerHTML = gameTiles.join("");

  NodeList.prototype.forEach = Array.prototype.forEach;
  var children = gameSelect.childNodes;
  console.log(children);
  children.forEach((item) => {
    item.addEventListener("click", () => {
      removeSelectedClass(children);
      item.classList.add("selected");
      generateRanksHTML(item.id);
    });
  });
}

main();
