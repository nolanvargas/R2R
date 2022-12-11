import Db from "./aws.js";

/**
 * Returns a list of HTML div elements based on the game provided.
 * It will automatically access the database for the data
 *
 * @param {string} game The id for the game
 *
 * @return {array} Returns a list of HTML div elements for each rank
 */
export async function generateRanksHTML(game) {
  // DB connection
  let db = new Db();

  // Grab rank data from the db using the specified game
  let rankData = await db.getTableContents(game);
  rankData = rankData.Items;

  // Sort the ranks
  rankData = rankData.sort((a, b) =>
    parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1
  );

  // This will produce basically the same html structure for
  // each rank tile, and will store each in a list.
  let rankHTML = [];
  rankData.forEach((item) => {
    rankHTML.push(
      `<div class='rankTile' id=${item.position.S} style="background-image:url(/rank_icons/${item.img.S});"><h3>${item.displayName.S}</h3></button></div>`
    );
  });

  return rankHTML;
}
