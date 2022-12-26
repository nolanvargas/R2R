import Db from "./aws";

export function generateResultsHTML(results, data) {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
  let iconsHTML = [];
  for (const [key, value] of Object.entries(results)) {
    rankName = data[key]["Items"][value - 1].displayName.S;
    rankImg = data[key]["Items"][value - 1].img.S;
    iconsHTML.push(buildResultHTML(rankName, rankImg));
  }
  selectedRankImg =
    data[sessionStorage.getItem("selectedGame")]["Items"][
      sessionStorage.getItem("selectedRank") - 1
    ].img.S;
  selectedRankName =
    data[sessionStorage.getItem("selectedGame")]["Items"][
      sessionStorage.getItem("selectedRank") - 1
    ].displayName.S;
  resultsHTML = `<div id="selectedRankIconPH" style='background-image:url(/rank_icons/${selectedRankImg})'></div><div id="selectedRankTextPH"><h3>${selectedRankName}</h3></div><div id="eqRanksPHParent">${iconsHTML.join(
    ""
  )}     
</div> <div id="backButton"><h4>Start Over</h4></div>`;
  return resultsHTML;
}

function buildResultHTML(rankName, rankImg) {
  return `<div class='eqRanksIconPH' style='background-image:url(/rank_icons/${rankImg})'>
          <h3 class='eqRankName'>${rankName}</h3>
      </div>`;
}
