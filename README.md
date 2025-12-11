🪙 Crypto Market Analytics Dashboard
A sleek, responsive, single-page web application designed to track and visualize real-time cryptocurrency market data. Built with vanilla HTML, CSS, and JavaScript, the dashboard uses the CoinGecko API and Chart.js library to provide an insightful overview of the crypto landscape.

✨ Features
Real-time Data: Fetches live market data using the CoinGecko API.

Key Metrics: Displays crucial stats for Bitcoin (BTC), Ethereum (ETH), Total Market Cap, and BTC Dominance.

Customizable Currency: Users can switch between USD, EUR, GBP, and JPY to view prices and market caps.

Interactive Charts: Visualizes the market capitalization and 24h volume distribution for the top cryptocurrencies using Chart.js.

Top 10 Table: A detailed, sortable table of the top 10 cryptocurrencies by market cap, including price, 24h change, market cap, and volume.

Responsive Design: Optimized for viewing on desktops, tablets, and mobile devices.

Dark Theme: Features an aesthetically pleasing dark theme for a better viewing experience.

🛠️ Tech Stack
Frontend:

HTML5

CSS3 (Vanilla, dark theme)

JavaScript (Vanilla for data fetching and DOM manipulation)

APIs & Libraries:

CoinGecko API: Used to fetch real-time crypto market data (/global and /coins/markets endpoints).

Chart.js: Used for rendering responsive and interactive charts (Bar and Doughnut).

🚀 Getting Started
This project is a standalone single-page HTML file (index.html or similar).

Prerequisites
You need a modern web browser to run the dashboard. No server-side setup is required.

Installation
Clone the repository (assuming you put this file in a repository):

Bash

git clone https://github.com/your-username/crypto-dashboard.git
cd crypto-dashboard
Open the file: Simply open the main HTML file (e.g., index.html) in your web browser.

Bash

open index.html # On macOS
start index.html # On Windows
The dashboard will automatically fetch data and display the current market analytics.

⚙️ Customization
The core logic resides in the <script> tag at the bottom of the HTML file.

1. Change Data Fetch Interval
The data refreshes every 60 seconds. You can change this interval in the initDashboard function:

JavaScript

// ... in the <script> block
function initDashboard() {
    // ... other code
    updateDashboard();
    // Change 60000 (1 minute) to your desired interval in milliseconds
    setInterval(updateDashboard, 60000); 
}
// ...
2. Update API Calls
The dashboard uses the following CoinGecko API endpoints. Note that CoinGecko may enforce rate limits:

Global Data: https://api.coingecko.com/api/v3/global

Top Coins Data: https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h

If you need to fetch more than the top 10 coins, adjust the per_page parameter in the fetchTopCoins function.

3. Change Styling
All styling is contained within the <style> block in the <head> section. You can easily modify colors, fonts, and layout using standard CSS rules.

Primary Background: #0f1419

Card Background: #1a1f26

Primary Accent Color (Positive): #10b981 (Green)

Negative Change Color: #ef4444 (Red)

🤝 Contributing
This is a personal project, but suggestions for improvements are always welcome!

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.
