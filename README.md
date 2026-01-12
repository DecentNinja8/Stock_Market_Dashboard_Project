PROJECT TITLE
Stock Market Dashboard 

A responsive and interactive stock market dashboard built using HTML, CSS, and JavaScript.  
The application visualizes real-time stock data with trend analysis, moving averages, volume insights, and a professional dark UI.

---------------------------------------------------------------------------------------

FEATURES

- Validated stock selection via dropdown
- Interactive trend and volume charts
- 7D / 1M / 3M time range analysis 
- Moving averages of 20 and 50 days
- Price, percentage change, weekly & monthly returns
- Trend-based colour indicators (green/red)
- Favourites with local storage
- Dark professional dashboard UI
---------------------------------------------------------------------------------------

TECH STACK

- HTML5
- CSS3 
- JavaScript 
- Chart.js
- TwelveData API
---------------------------------------------------------------------------------------

PROJECT STRUCTURE

Stock_Market_Dashboard_Project
			|----index.html
			|----style.css
			|----script.js
			|----README.md
			
---------------------------------------------------------------------------------------

SETUP INSTRUCTIONS

Q. How to Run Locally?

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. Ensure internet connection for API data
4. Replace the API_KEY in `script.js` with your own TwelveData API key.

	const API_KEY = "YOUR API KEY HERE";

5. You can also give your own name by replacing "ARGH" in h1 and title tag in index.html

	<title> "YOUR NAME" Stock Dashboard</title>
	<h1> "YOUR NAME" Stock Market Dashboard</h1>
---------------------------------------------------------------------------------------

WORKING OF THE APPLICATION

- User selects a stock from dropdown
- App fetches market data from TwelveData API
- Trend and volume charts update dynamically
- Favorites are stored using localStorage

---------------------------------------------------------------------------------------

FUTURE IMPROVEMENTS

- Add more stock exchanges
- Add comparison between multiple stocks
- Improve performance with caching
---------------------------------------------------------------------------------------

AUTHOR

Arghadeep Kundu

