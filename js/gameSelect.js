export function generateGameSelectHTML(name, imgLink, id) {
  return `<div class='gameTile'><button name="${id}" class="gameSelectButton"><img src=${imgLink}><h3>${name}</h3></button></div>`;
}
