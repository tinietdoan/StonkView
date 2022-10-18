# StonkView

## Team Members
- Sidhant Puntambekar 
- Taiske Colclasure
- Tinie Doan

## Application Description

StonkView is designed to help amateur traders and finance professionals view financial securities information from one centralized website. Users of StonkView will be able to connect with a list of their favorite stocks and corresponding charts from the Dow Jones Industrial Average, S&P 500 as well as the NASDAQ and analyze them with standard technical indicators such as the relative strength index (RSI), moving average convergence divergence (MACD), and many more. Users will also be able to connect with others through a limited social network in order to share interesting analysis as well as stocks that are being watched by fellow traders. Individual users will also be able to set notifications for when a stock hits a certain price (indicating whether to buy or short) or when stocks become underbought or undersold. StonkView will also aim to present a daily notification to users about the top ten potential stocks to watch for in the next trading day and the upcoming week. 

StonkView is intended to have two main functions of analyzing stock charts and connecting traders with each other. Functionality of the site will include a location where individuals can select stocks of interest and perform technical analysis while the other part of the website will be a social media style platform. We also intend to connect users to financial news headlines from SeekingAlpha and MarketWatch. Users will be able to manage their notification schedules for certain stocks and make maximum use of when the best buying/shorting positions become available. 

In terms of user value, StonkView provides a one stop shop stock watchlist website where traders can actively interact with stock chart analysis and make better trading decisions based on that information. Allowing users the ability to not only analyze stocks, but share their information collectively with other users will lead to a cumulative growth of trading knowledge for the user base. StonkView is intended to not only give traders access to the technical stock metrics they desire, but also to connect traders with one another in a social media style platform. 

## Application Architechture

The frontend of StonkView is made from HTML/CSS/Client side JavaScript. This includes the various components on each page as well as the UI components such as buttons and cards. The backend is written in Node.js and serves the various frontend components from external stock APIs such as Finnhub. We use a mongoose middleware to conenct the Node.js backend to the database which is a MongoDB cloud based cluster. 

## Running Application

You can run StonkView by either visiting: https://stonkview.herokuapp.com/ 
or cloning this GitHub repository, changing directory to the "project" folder, and running ```npm install``` to install all Node.js dependencies followed by ```npm run start``` which will start the server on https://localhost:3001

## Repository Structure
  * The "project" folder contains all of the source code for StonkView. This contains our server.js file backend as well as a "views" folder for each page of the website.   
