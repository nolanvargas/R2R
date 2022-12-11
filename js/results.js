import Db from "./aws";

export function resultsHTML(results, data) {
  let iconsHTML = [];
  for (const [key, value] of Object.entries(results)) {
    rankName = data[key]["Items"][value].displayName.S;
    rankImg = data[key]["Items"][value].img.S;
    iconsHTML.push(buildResultHTML(rankName, rankImg));
  }
  selectedRankImg =
    data[sessionStorage.getItem("selectedGame")]["Items"][
      sessionStorage.getItem("selectedRank")
    ].img.S;
  selectedRankName =
    data[sessionStorage.getItem("selectedGame")]["Items"][
      sessionStorage.getItem("selectedRank")
    ].displayName.S;
  resultsHTML = `<div id="selectedRankIconPH" style='background-image:url(/rank_icons/${selectedRankImg})'></div><div id="selectedRankTextPH"><h3>${selectedRankName}</h3></div><div id="eqRanksPHParent">${iconsHTML.join(
    ""
  )}</div>`;
  return resultsHTML;
}

function buildResultHTML(rankName, rankImg) {
  return `<div class='eqRanksIconPH' style='background-image:url(/rank_icons/${rankImg})'>
          <h3 class='eqRankName'>${rankName}</h3>
      </div>`;
}
