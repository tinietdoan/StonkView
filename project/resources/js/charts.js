function loadStocksPage(event) {
  //event.preventDefault();
  var tickerStock = event.target['ticker'].value;
  console.log(tickerStock);

  fetch(`https://finnhub.io/api/v1/quote?symbol=${tickerStock}&token=c0qniqv48v6q5go2lo6g`)
    .then((response) => response.json())
    .then((data) => {
      
      console.log(data);
      var indexes = document.getElementById("stockDataTable");

      indexesLength = parseInt(indexes.rows.length);
      indexes.rows[1].cells[1].innerHTML = JSON.stringify(data.c);
      indexes.rows[2].cells[1].innerHTML = JSON.stringify(data.h);
      indexes.rows[3].cells[1].innerHTML = JSON.stringify(data.l);
      indexes.rows[4].cells[1].innerHTML = JSON.stringify(data.o);
      console.log(data.c);
    });
}