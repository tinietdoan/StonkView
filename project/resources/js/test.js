fetch("https://finnhub.io/api/v1/quote?symbol=QQQ&token=c0qniqv48v6q5go2lo6g")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var indexes = document.getElementById("indexes");
    var NasdaqNotRounded = data.c*41.578
    var NasdaqRounded = NasdaqNotRounded.toFixed(2)
    indexesLength = parseInt(indexes.rows.length);
    indexes.rows[1].cells[2].innerHTML = NasdaqRounded.toString();
    console.log(data.c);
  });

fetch("https://finnhub.io/api/v1/quote?symbol=SPY&token=c0qniqv48v6q5go2lo6g")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var indexes = document.getElementById("indexes");
    indexesLength = parseInt(indexes.rows.length);
    var SPNotRounded = data.c*10
    var SPRounded = SPNotRounded.toFixed(2)
    indexes.rows[1].cells[1].innerHTML = SPRounded.toString();
    console.log(data.c);
  });

fetch("https://finnhub.io/api/v1/quote?symbol=DIA&token=c0qniqv48v6q5go2lo6g")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var indexes = document.getElementById("indexes");
    indexesLength = parseInt(indexes.rows.length);
    var DowNotRounded = data.c*100
    var DowRounded = DowNotRounded.toFixed(2)
    indexes.rows[1].cells[0].innerHTML = DowRounded.toString();
    console.log(data.c);
  });

// fetch("https://finnhub.io/api/v1/quote?symbol=SPY&token=c0qniqv48v6q5go2lo6g")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     var portfolio = document.getElementById("user_portfolio");
//     portfolioLength = parseInt(portfolio.rows.length);
//     portfolio.rows[1].cells[0].innerHTML = "$SPY";
//     portfolio.rows[1].cells[1].innerHTML = JSON.stringify(data.c);
//     portfolio.rows[1].cells[2].innerHTML = JSON.stringify(data.h);
//     portfolio.rows[1].cells[3].innerHTML = JSON.stringify(data.l);
//     portfolio.rows[1].cells[4].innerHTML = JSON.stringify(data.pc);
//     portfolio.rows[1].cells[5].innerHTML = JSON.stringify(data.t);
//     console.log(data.c);
//     console.log(portfolio);
//   });

// fetch("https://finnhub.io/api/v1/quote?symbol=AAPL&token=c0qniqv48v6q5go2lo6g")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     var portfolio = document.getElementById("user_portfolio");
//     portfolioLength = parseInt(portfolio.rows.length);
//     portfolio.rows[2].cells[0].innerHTML = "$AAPL";
//     portfolio.rows[2].cells[1].innerHTML = JSON.stringify(data.c);
//     portfolio.rows[2].cells[2].innerHTML = JSON.stringify(data.h);
//     portfolio.rows[2].cells[3].innerHTML = JSON.stringify(data.l);
//     portfolio.rows[2].cells[4].innerHTML = JSON.stringify(data.pc);
//     portfolio.rows[2].cells[5].innerHTML = JSON.stringify(data.t);
//     console.log(data.c);
//     console.log(portfolio);
//   });

// fetch("https://finnhub.io/api/v1/quote?symbol=TSLA&token=c0qniqv48v6q5go2lo6g")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     var portfolio = document.getElementById("user_portfolio");
//     portfolioLength = parseInt(portfolio.rows.length);
//     portfolio.rows[3].cells[0].innerHTML = "$TSLA";
//     portfolio.rows[3].cells[1].innerHTML = JSON.stringify(data.c);
//     portfolio.rows[3].cells[2].innerHTML = JSON.stringify(data.h);
//     portfolio.rows[3].cells[3].innerHTML = JSON.stringify(data.l);
//     portfolio.rows[3].cells[4].innerHTML = JSON.stringify(data.pc);
//     portfolio.rows[3].cells[5].innerHTML = JSON.stringify(data.t);
//     console.log(data.c);
//     console.log(portfolio);
//   });
