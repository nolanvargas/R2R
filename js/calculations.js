// ********************************
// This file will handle the calculations
// ********************************

/**
 * Calculates the equivalent ranks for the selected game and rank
 * @param {Object} data The key value pairs for each game, key being the game id,
 * and the value being the list of data for each rank
 * @return {Object} Returns key value pairs with key being game id, and value being
 * the equivalent rank
 */
export function computeEquivalentRanks(data) {
  // This will be the percent of player that are below the skill level at selected rank
  let rankPercentile = 0;

  // sg -> selected game -> each rank of the selected game
  let sg = data[sessionStorage.getItem("selectedGame")]["Items"];

  //Total population for our selected game
  let selectedGamePopulation = 0;

  //List of population for each rank which we will combine
  let selectedGameIndividualPopulations = [];

  // Sort the ranks
  sg = sg.sort((a, b) =>
    parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1
  );

  // Get some feedback on this
  // Calculates the total population percent, which usually is between 99 and 100
  // or also my be slightly above 100, but is important for accuracy
  sg.forEach((rank) => {
    selectedGameIndividualPopulations.push(rank.population.S);
  });
  selectedGamePopulation =
    selectedGameIndividualPopulations.reduce(combineFloats);

  // Calculate the population percent below the rank selected, hence (rank - 1)
  let selectedGameCumulative = 0;
  // Like python for i in range():
  for (const i of Array(
    parseInt(sessionStorage.getItem("selectedRank") - 1)
  ).keys()) {
    selectedGameCumulative = combineFloats(
      selectedGameCumulative,
      sg[i].population.S
    );
  }

  // The most important calculation for the percentile that the rank falls in
  selectedGameRankPercentile = selectedGameCumulative / selectedGamePopulation;

  // Time to compute the equivalent ranks
  let equivalentRanks = {};

  for (const [key, value] of Object.entries(data)) {
    let i = 0;
    let cumulative = 0;
    let percentile = 0;
    let totalPopulation = 0;
    let ranks = value["Items"];
    let rankPopulations = [];

    // Sort the ranks
    ranks = ranks.sort((a, b) =>
      parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1
    );

    // Populating rankPopulations
    for (const i of Array(parseInt(ranks.length - 1)).keys()) {
      rankPopulations.push(ranks[i].population.S);
    }
    // Calculating total population to use in percentile calculations
    totalPopulation = rankPopulations.reduce(combineFloats);

    while (cumulative / totalPopulation < selectedGameRankPercentile) {
      cumulative = combineFloats(ranks[i].population.S, cumulative);
      i++;
    }

    // Add completed calculations to results object
    equivalentRanks[key] = ranks[i].position.S;
  }
  return equivalentRanks;
}

function combineFloats(a, b) {
  return parseFloat(a) + parseFloat(b);
}

function combineInts(a, b) {
  return parseInt(a) + parseInt(b);
}
