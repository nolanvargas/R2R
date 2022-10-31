import Db from "./aws.js";

export async function generateRanksHTML(game) {
  let db = new Db();
  let rankSelect = document.querySelector("#rankSelect");

  let rankData = await db.getTableContents(game);
  rankData = rankData.Items;

  console.log(typeof rankData);
  let rankHTML = "";
  rankData.forEach((item) => {
    let rankTile = `<div class='rankTile'><button class="gameSelectButton"><img src="#"><h3>${item.rank.S}</h3></button></div>`;
    rankHTML += rankTile;
  });

  rankSelect.innerHTML = rankHTML;
}
