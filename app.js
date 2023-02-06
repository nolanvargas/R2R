var $5TXzU$awssdkclientcognitoidentity = require("@aws-sdk/client-cognito-identity");
var $5TXzU$awssdkclientdynamodb = require("@aws-sdk/client-dynamodb");
var $5TXzU$awssdkcredentialprovidercognitoidentity = require("@aws-sdk/credential-provider-cognito-identity");




const $9137a6d4d66862ff$var$client = new (0, $5TXzU$awssdkclientdynamodb.DynamoDBClient)({
    region: "us-west-2",
    credentials: (0, $5TXzU$awssdkcredentialprovidercognitoidentity.fromCognitoIdentityPool)({
        client: new (0, $5TXzU$awssdkclientcognitoidentity.CognitoIdentityClient)({
            region: "us-west-2"
        }),
        identityPoolId: "us-west-2:a5938208-e53f-4ba8-a4d8-70eb05172dbf"
    })
});
class $9137a6d4d66862ff$export$2e2bcd8739ae039 {
    async getTableContents(tableName) {
        try {
            return await $9137a6d4d66862ff$var$client.send(new (0, $5TXzU$awssdkclientdynamodb.ScanCommand)({
                TableName: tableName
            }));
        } catch (err) {
            return err;
        }
    }
    async addClient(credentials) {
        const request = {
            PutItem: {
                TableName: "users",
                Item: {
                    id: {
                        N: "1"
                    },
                    name: {
                        S: "John Doe"
                    },
                    age: {
                        N: "35"
                    }
                }
            }
        };
        try {
            // Write the item to the table
            const response = await $9137a6d4d66862ff$var$client.send(request);
        } catch (err) {
            return err;
        }
    }
    async validateClient(username) {
        const params = {
            TableName: "users",
            Key: {
                username: {
                    S: username
                }
            }
        };
        const getItemCommand = new (0, $5TXzU$awssdkclientdynamodb.GetItemCommand)(params);
        $9137a6d4d66862ff$var$client.send(getItemCommand).then((data)=>{
            // The item was retrieved successfully, and the result is available in the "data" variable
            return data;
        }).catch((err)=>{
            // Handle any errors that occurred
            console.error(err);
        });
    }
}



async function $f811adf7d9384101$export$5ca475a3818ed0e4(game) {
    // DB connection
    let db = new (0, $9137a6d4d66862ff$export$2e2bcd8739ae039)();
    // Grab rank data from the db using the specified game
    let rankData = await db.getTableContents(game);
    rankData = rankData.Items;
    // Sort the ranks
    rankData = rankData.sort((a, b)=>parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1);
    // This will produce basically the same html structure for
    // each rank tile, and will store each in a list.
    let rankHTML = [];
    rankData.forEach((item)=>{
        rankHTML.push(`<div class='rankTile' id=${item.position.S} style="background-image:url(/rank_icons/${item.img.S});"><h3>${item.displayName.S}</h3></button></div>`);
    });
    return rankHTML;
}


function $0df8ffa2a572bcc5$export$523011ce6d7eedd1(data) {
    // This will be the percent of player that are below the skill level at selected rank
    let rankPercentile = 0;
    // sg -> selected game -> each rank of the selected game
    let sg = data[sessionStorage.getItem("selectedGame")]["Items"];
    //Total population for our selected game
    let selectedGamePopulation = 0;
    //List of population for each rank which we will combine
    let selectedGameIndividualPopulations = [];
    // Sort the ranks
    sg = sg.sort((a, b)=>parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1);
    // Get some feedback on this
    // Calculates the total population percent, which usually is between 99 and 100
    // or also my be slightly above 100, but is important for accuracy
    sg.forEach((rank)=>{
        selectedGameIndividualPopulations.push(rank.population.S);
    });
    selectedGamePopulation = selectedGameIndividualPopulations.reduce($0df8ffa2a572bcc5$var$combineFloats);
    // Calculate the population percent below the rank selected, hence (rank - 1)
    let selectedGameCumulative = 0;
    // Like python for i in range():
    for (const i of Array(parseInt(sessionStorage.getItem("selectedRank") - 1)).keys())selectedGameCumulative = $0df8ffa2a572bcc5$var$combineFloats(selectedGameCumulative, sg[i].population.S);
    // The most important calculation for the percentile that the rank falls in
    selectedGameRankPercentile = selectedGameCumulative / selectedGamePopulation;
    // Time to compute the equivalent ranks
    let equivalentRanks = {};
    for (const [key, value] of Object.entries(data)){
        let i1 = 0;
        let cumulative = 0;
        let percentile = 0;
        let totalPopulation = 0;
        let ranks = value["Items"];
        let rankPopulations = [];
        // Sort the ranks
        ranks = ranks.sort((a, b)=>parseInt(a.position.S) > parseInt(b.position.S) ? 1 : -1);
        // Populating rankPopulations
        for (const i2 of Array(parseInt(ranks.length - 1)).keys())rankPopulations.push(ranks[i2].population.S);
        // Calculating total population to use in percentile calculations
        totalPopulation = rankPopulations.reduce($0df8ffa2a572bcc5$var$combineFloats);
        while(cumulative / totalPopulation < selectedGameRankPercentile){
            cumulative = $0df8ffa2a572bcc5$var$combineFloats(ranks[i1].population.S, cumulative);
            i1++;
        }
        // Add completed calculations to results object
        equivalentRanks[key] = ranks[i1].position.S;
    }
    return equivalentRanks;
}
function $0df8ffa2a572bcc5$var$combineFloats(a, b) {
    return parseFloat(a) + parseFloat(b);
}
function $0df8ffa2a572bcc5$var$combineInts(a, b) {
    return parseInt(a) + parseInt(b);
}



function $ee9efad913a62fbf$export$b49f72c3808f7248(results, data) {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    let iconsHTML = [];
    for (const [key, value] of Object.entries(results)){
        rankName = data[key]["Items"][value - 1].displayName.S;
        rankImg = data[key]["Items"][value - 1].img.S;
        iconsHTML.push($ee9efad913a62fbf$var$buildResultHTML(rankName, rankImg));
    }
    selectedRankImg = data[sessionStorage.getItem("selectedGame")]["Items"][sessionStorage.getItem("selectedRank") - 1].img.S;
    selectedRankName = data[sessionStorage.getItem("selectedGame")]["Items"][sessionStorage.getItem("selectedRank") - 1].displayName.S;
    resultsHTML = `<div id="selectedRankIconPH" style='background-image:url(/rank_icons/${selectedRankImg})'></div><div id="selectedRankTextPH"><h3>${selectedRankName}</h3></div><div id="eqRanksPHParent">${iconsHTML.join("")}     
</div> <div id="backButton"><h4>Start Over</h4></div>`;
    return resultsHTML;
}
function $ee9efad913a62fbf$var$buildResultHTML(rankName1, rankImg1) {
    return `<div class='eqRanksIconPH' style='background-image:url(/rank_icons/${rankImg1})'>
          <h3 class='eqRankName'>${rankName1}</h3>
      </div>`;
}


function $091767272193eae6$export$c069aeea29afc4f8() {
    document.querySelector("#content").innerHTML = `<div id="gameSelect">
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
        <div class="gameTile">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt"
            height="221.000000pt"
            viewBox="0 0 300.000000 221.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,221.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M935 2064 c-210 -32 -282 -60 -368 -143 -116 -112 -210 -290 -306
          -579 -96 -288 -175 -761 -151 -907 17 -107 93 -204 198 -253 50 -24 70 -27
          157 -27 94 0 105 2 170 34 92 45 158 114 322 332 72 96 144 186 160 201 138
          131 626 131 767 0 16 -15 87 -106 159 -202 159 -214 228 -285 322 -331 65 -32
          76 -34 170 -34 90 0 106 3 159 29 76 37 141 102 173 173 21 46 26 71 25 137 0
          145 -41 428 -88 626 -52 213 -163 504 -245 643 -57 97 -167 209 -231 237 -116
          50 -354 81 -463 61 -90 -17 -143 -55 -181 -127 -17 -33 -33 -65 -35 -72 -5
          -16 -146 -27 -232 -18 -64 7 -66 9 -77 41 -22 66 -69 123 -124 150 -43 21 -70
          26 -152 29 -54 3 -112 2 -129 0z m1178 -405 c40 -22 64 -54 71 -96 14 -78 -50
          -153 -129 -153 -37 0 -92 35 -110 70 -30 57 -9 141 44 173 30 19 93 22 124 6z
          m-1155 -29 c61 0 67 -9 65 -99 l-2 -81 78 0 c58 0 82 -4 91 -15 15 -18 14
          -205 -1 -220 -5 -5 -44 -11 -86 -15 l-78 -5 -1 -73 c0 -43 -5 -77 -13 -85 -7
          -7 -48 -13 -107 -14 -123 -3 -134 6 -134 107 l0 70 -67 1 c-38 1 -71 1 -75 0
          -4 0 -15 11 -24 25 -14 21 -16 40 -10 116 4 56 11 95 19 100 6 4 44 8 83 8
          l72 0 3 79 c2 44 8 83 12 87 9 10 105 23 125 18 8 -2 30 -4 50 -4z m956 -201
          c30 -24 57 -80 51 -109 -18 -94 -103 -143 -189 -110 -27 10 -62 58 -72 98 -9
          34 22 105 53 124 41 25 123 24 157 -3z m452 -14 c30 -35 38 -64 31 -116 -6
          -43 -37 -75 -91 -95 -41 -15 -122 7 -131 36 -4 11 -10 20 -15 20 -18 0 -22 78
          -5 115 29 60 60 78 128 73 49 -4 62 -9 83 -33z m-229 -204 c31 -23 41 -38 46
          -68 21 -128 -111 -211 -204 -130 -35 30 -49 59 -49 99 2 111 115 165 207 99z"
              />
            </g>
          </svg>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
      <div id="rankSelect"></div>
      <div id="submitButton" class="disabled"><h4>Generate</h4></div>`;
}


let $fcefbc93a2cbc3e7$var$db = new (0, $9137a6d4d66862ff$export$2e2bcd8739ae039)();
// Returns the contents of the games table
async function $fcefbc93a2cbc3e7$var$getGames() {
    const games = await $fcefbc93a2cbc3e7$var$db.getTableContents("games");
    return games;
}
// Generate game tile HTML
function $fcefbc93a2cbc3e7$var$generateGameSelectHTML(name, imgLink, id) {
    return `<div class='gameTile' id="${id}" class="gameSelectButton"><img src=${imgLink}><h3>${name}</h3></div>`;
}
// Returns an array of games (not display names)
async function $fcefbc93a2cbc3e7$var$createGamesList() {
    const games = await $fcefbc93a2cbc3e7$var$getGames();
    gamesList = new Array();
    games.Items.map((game)=>{
        gamesList.push(game.game.S);
    });
    return gamesList;
}
// Goes through each game tile and removes 'selected' class
function $fcefbc93a2cbc3e7$var$removeSelectedClass(gameTiles) {
    gameTiles.forEach((gameTile)=>{
        gameTile.classList.remove("selected");
    });
}
// Deletes all rank html and TODO load skeleton
function $fcefbc93a2cbc3e7$var$reloadRanks() {
    document.querySelector("#rankSelect").innerHTML = "";
//set skeleton screen
}
function $fcefbc93a2cbc3e7$var$switchToResults() {
    document.querySelector("#content").innerHTML = '<div id="selectedRankIconPH" class="skeleton"></div><div id="selectedRankTextPH" class="skeleton-text skeleton"></div><div id="eqRanksPHParent"><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div><div id="eqRanksIconPH" class="skeleton"></div></div>';
}
function $fcefbc93a2cbc3e7$var$deployResults(resultsHTML) {
    document.querySelector("#content").innerHTML = resultsHTML;
    document.querySelector("#backButton").addEventListener("click", (e)=>{
        $fcefbc93a2cbc3e7$var$homeView();
    });
}
async function $fcefbc93a2cbc3e7$var$retrieveGameData(game) {
    let db = new (0, $9137a6d4d66862ff$export$2e2bcd8739ae039)();
    let gameData = await db.getTableContents(game.id.S);
    return gameData;
}
async function $fcefbc93a2cbc3e7$var$getAllData(games) {
    let data = {};
    for (const game of games){
        let gameData = await $fcefbc93a2cbc3e7$var$retrieveGameData(game);
        let gameName = game.id.S;
        data[gameName] = gameData;
    }
    return data;
}
/**
 * Adds click listeners to each rank tile
 *
 * @param {Element} rankSelect Pass in the element that holds the rank tiles
 */ function $fcefbc93a2cbc3e7$var$addRankEventListeners(rankSelect) {
    let ranks = rankSelect.childNodes;
    ranks.forEach((rank)=>{
        rank.addEventListener("click", async (e)=>{
            // Happens when a rank tile is clicked
            selectedRank = rank.id;
            $fcefbc93a2cbc3e7$var$removeSelectedClass(ranks);
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
function $fcefbc93a2cbc3e7$var$loginView() {
    document.querySelector("#content").innerHTML = `<div id="loginContainer">
    <h2>Login</h2>
        <form class="login-form">
      <input
        type="text" name='username' id='username' placeholder="Username"
                />
            <input
              type="password" name='password' id='password' placeholder="Password"
        />
        <h3 id="createAnAccount">
        Create an account
        </h3> 
        <h3 id="forgotPassword">
        Forgot your password?
        </h3> <button>LOGIN</button>
      </form>
  </div>`;
    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        const username = loginForm.elements["username"];
        const password = loginForm.elements["password"];
        console.log(username.value, password.value);
        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
                login: username.value,
                password: password.value,
                userId: 1
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((response)=>response.json()).then((json)=>console.log(json));
    });
}
async function $fcefbc93a2cbc3e7$var$homeView() {
    // Reset html for home view
    (0, $091767272193eae6$export$c069aeea29afc4f8)();
    // List of game ids
    let games = await $fcefbc93a2cbc3e7$var$getGames();
    games = games.Items;
    // Both sections of the first view
    let gameSelect = document.querySelector("#gameSelect");
    let rankSelect = document.querySelector("#rankSelect");
    let gameTiles = [];
    // Create each game tile
    games.forEach((game)=>{
        gameTiles.push($fcefbc93a2cbc3e7$var$generateGameSelectHTML(game.game.S, `/game_icons/${game.img.S}`, game.id.S));
    });
    // Load HTML into the DOM
    gameSelect.innerHTML = gameTiles.join("");
    // Arrays foreach is what we want
    NodeList.prototype.forEach = Array.prototype.forEach;
    let children = gameSelect.childNodes;
    children.forEach((item)=>{
        item.addEventListener("click", async (e)=>{
            // Any game may have been already selected, so we need to run through each
            $fcefbc93a2cbc3e7$var$removeSelectedClass(children);
            // Disable the submit button
            document.querySelector("#submitButton").classList.replace("enabled", "disabled");
            // Set the session to have the selected game
            sessionStorage.setItem("selectedGame", item.id);
            sessionStorage.setItem("isGameSelected", true);
            // Clear rankSelect and populate with skeleton
            $fcefbc93a2cbc3e7$var$reloadRanks();
            item.classList.add("selected");
            // Build the HTML for the ranks
            let rankHTML = await (0, $f811adf7d9384101$export$5ca475a3818ed0e4)(item.id);
            // Insert the HTML into the DOM
            rankSelect.innerHTML = rankHTML.join("");
            // Now we wait until a rank is selected, or a new game is selected
            // (which will run this function (lambda?) again)
            $fcefbc93a2cbc3e7$var$addRankEventListeners(rankSelect);
        });
    });
    let submitButton = document.querySelector("#submitButton");
    submitButton.addEventListener("click", async (e)=>{
        if (sessionStorage.getItem("isRankSelected") && sessionStorage.getItem("isRankSelected")) {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
            // Switch to results skeleton
            $fcefbc93a2cbc3e7$var$switchToResults();
            // Grab every game id in the database
            let games = await $fcefbc93a2cbc3e7$var$getGames();
            // Use this to grab all the data for each game
            // This uses a lot of resources but is necessary because
            // each rank percentile equivalent needs to be calculated
            const data = await $fcefbc93a2cbc3e7$var$getAllData(games["Items"]);
            // Grab the HTML for the results
            const eqRanks = (0, $0df8ffa2a572bcc5$export$523011ce6d7eedd1)(data);
            // Put the results in the session storage
            sessionStorage.setItem("results", eqRanks);
            const resultsHTML = (0, $ee9efad913a62fbf$export$b49f72c3808f7248)(eqRanks, data);
            $fcefbc93a2cbc3e7$var$deployResults(resultsHTML);
        }
    });
}
function $fcefbc93a2cbc3e7$var$resetSelections() {
    sessionStorage.setItem("isGameSelected", false);
    sessionStorage.setItem("isRankSelected", false);
    sessionStorage.setItem("selectedGame", "");
    sessionStorage.setItem("selectedRank", "");
}
function $fcefbc93a2cbc3e7$var$toggleMenu() {
    let icon1 = document.getElementById("a");
    let icon2 = document.getElementById("b");
    let icon3 = document.getElementById("c");
    let nav = document.getElementById("nav");
    let blue = document.getElementById("grey");
    icon1.classList.toggle("a");
    icon2.classList.toggle("c");
    icon3.classList.toggle("b");
    nav.classList.toggle("show");
    nav.classList.toggle("hidden");
    blue.classList.toggle("slide");
}
async function $fcefbc93a2cbc3e7$var$main() {
    //********MENU BUTTON**********************
    let menuButton = document.querySelector(".hamburger-icon");
    menuButton.addEventListener("click", function() {
        $fcefbc93a2cbc3e7$var$toggleMenu();
    });
    const navBar = document.getElementById("nav");
    window.addEventListener("scroll", ()=>{
        if (navBar.classList.contains("show")) $fcefbc93a2cbc3e7$var$toggleMenu();
    });
    //*****************************************
    //***********NAV BUTTONS*******************
    let compareRanks = document.querySelector("#compareRanks");
    let login = document.querySelector("#login");
    let about = document.querySelector("#about");
    compareRanks.addEventListener("click", async (e)=>{
        $fcefbc93a2cbc3e7$var$toggleMenu();
        await $fcefbc93a2cbc3e7$var$homeView();
        $fcefbc93a2cbc3e7$var$resetSelections();
    });
    login.addEventListener("click", (e)=>{
        $fcefbc93a2cbc3e7$var$loginView();
        console.log("a");
        $fcefbc93a2cbc3e7$var$toggleMenu();
    });
    //*****************************************
    // SESSION VARIABLES
    sessionStorage.clear();
    sessionStorage.setItem("isGameSelected", false);
    sessionStorage.setItem("isRankSelected", false);
    sessionStorage.setItem("selectedGame", "");
    sessionStorage.setItem("selectedRank", "");
    await $fcefbc93a2cbc3e7$var$homeView();
}
$fcefbc93a2cbc3e7$var$main();


//# sourceMappingURL=app.js.map
