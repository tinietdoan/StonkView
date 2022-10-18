function testConsole() {
  console.log(5);
}

function appendRows() {
  var newsTable = document.getElementById("newsTableBody");
  for (var i = 0; i < 24; i++) {
    var row = newsTable.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    (cell1.innerHTML = 0),
      (cell2.innerHTML = 0),
      (cell3.innerHTML = 0),
      (cell4.innerHTML = 0);
  }
}

fetch(
  "https://finnhub.io/api/v1/news?category=general&token=c0qniqv48v6q5go2lo6g"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var newsTable = document.getElementById("news");
    var gridContainer = document.getElementById('cardContainer');
    var JSONLength = Object.keys(data).length;
    var cardsPop = 0;
    for (var i = 0; i < 25; i++) {
      var cardHoldRow = document.createElement('div');
      cardHoldRow.className = 'row';
      for (var j = 0; j < 4; j++) {
        var cardContainCol = document.createElement('div');
        cardContainCol.className = 'col-lg-3';
        var card = document.createElement('div');
        card.className = 'card';
        var cardIMG = document.createElement('img');
        cardIMG.className = "card-img-top";
        cardIMG.setAttribute('src', data[cardsPop].image);
        cardIMG.setAttribute('alt', 'No Image')
        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        var title = document.createElement('h5');
        title.innerText = data[cardsPop].headline;
        title.className = 'card-title';
        var link = document.createElement('a');
        link.className = 'btn btn-success center';
        link.setAttribute('href', data[cardsPop].url);
        link.innerHTML = 'Link';
        cardBody.appendChild(title);
        cardBody.appendChild(link);
        card.appendChild(cardIMG);
        card.appendChild(cardBody);
        cardsPop++;
        var cardContainer = document.createElement('div');
        cardContainer.className = 'news-card-container';
        cardContainer.appendChild(card);

        cardContainCol.appendChild(cardContainer);

        cardHoldRow.appendChild(cardContainCol);
      }
      gridContainer.appendChild(cardHoldRow);
    
    }
  });
