let marketCapChart, volumeChart;
        let currentCurrency = 'usd';

        const currencySymbols = {
            usd: '$',
            eur: '€',
            gbp: '£',
            jpy: '¥'
        };

        function formatNumber(num, currency = 'usd') {
            if (num >= 1e12) return currencySymbols[currency] + (num / 1e12).toFixed(2) + 'T';
            if (num >= 1e9) return currencySymbols[currency] + (num / 1e9).toFixed(2) + 'B';
            if (num >= 1e6) return currencySymbols[currency] + (num / 1e6).toFixed(2) + 'M';
            if (num >= 1e3) return currencySymbols[currency] + (num / 1e3).toFixed(2) + 'K';
            return currencySymbols[currency] + num.toFixed(2);
        }

        function formatPrice(price, currency = 'usd') {
            const symbol = currencySymbols[currency];
            if (price >= 1000) {
                return symbol + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            } else if (price >= 1) {
                return symbol + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
                return symbol + price.toFixed(6);
            }
        }

        function initDashboard() {
            const now = new Date();
            document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            updateDashboard();
            setInterval(updateDashboard, 60000);
        }

        async function updateDashboard() {
            currentCurrency = document.getElementById('currencyFilter').value;
            
            try {
                document.getElementById('errorMessage').innerHTML = '';
                
                await Promise.all([
                    fetchGlobalData(),
                    fetchTopCoins()
                ]);
                
            } catch (error) {
                console.error('Error updating dashboard:', error);
                document.getElementById('errorMessage').innerHTML = 
                    `<div class="error">⚠️ Error loading data: ${error.message}. Please try again.</div>`;
            }
        }

        async function fetchGlobalData() {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/global');
                const data = await response.json();
                
                const globalData = data.data;
                const marketCap = globalData.total_market_cap[currentCurrency];
                const marketCapChange = globalData.market_cap_change_percentage_24h_usd;
                const btcDominance = globalData.market_cap_percentage.btc;
                
                document.getElementById('marketCap').textContent = formatNumber(marketCap, currentCurrency);
                updateChangeElement('marketChange', marketCapChange);
                document.getElementById('btcDominance').textContent = btcDominance.toFixed(2) + '%';
                
            } catch (error) {
                console.error('Error fetching global data:', error);
            }
        }

        async function fetchTopCoins() {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
                );
                const coins = await response.json();
                
                const btc = coins.find(coin => coin.id === 'bitcoin');
                const eth = coins.find(coin => coin.id === 'ethereum');
                
                if (btc) {
                    document.getElementById('btcPrice').textContent = formatPrice(btc.current_price, currentCurrency);
                    updateChangeElement('btcChange', btc.price_change_percentage_24h);
                }
                
                if (eth) {
                    document.getElementById('ethPrice').textContent = formatPrice(eth.current_price, currentCurrency);
                    updateChangeElement('ethChange', eth.price_change_percentage_24h);
                }
                
                updateTable(coins);
                updateCharts(coins);
                
            } catch (error) {
                console.error('Error fetching coins:', error);
                throw error;
            }
        }

        function updateChangeElement(elementId, change) {
            const el = document.getElementById(elementId);
            const isPositive = change >= 0;
            el.className = 'change ' + (isPositive ? 'positive' : 'negative');
            el.innerHTML = `<span>${isPositive ? '▲' : '▼'}</span> ${Math.abs(change).toFixed(2)}% (24h)`;
        }

        function updateTable(coins) {
            const tbody = document.getElementById('cryptoTableBody');
            tbody.innerHTML = '';
            
            coins.forEach((coin, index) => {
                const row = tbody.insertRow();
                const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
                
                row.innerHTML = `
                    <td><strong>${index + 1}</strong></td>
                    <td>
                        <div class="coin-name">
                            <img src="${coin.image}" alt="${coin.name}" class="coin-logo">
                            <div>
                                <strong>${coin.name}</strong>
                                <div style="font-size: 11px; color: #9ca3af;">${coin.symbol.toUpperCase()}</div>
                            </div>
                        </div>
                    </td>
                    <td><strong>${formatPrice(coin.current_price, currentCurrency)}</strong></td>
                    <td class="${changeClass}">
                        ${coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} 
                        ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </td>
                    <td>${formatNumber(coin.market_cap, currentCurrency)}</td>
                    <td>${formatNumber(coin.total_volume, currentCurrency)}</td>
                `;
            });
            
            document.getElementById('loadingTable').style.display = 'none';
            document.getElementById('cryptoTable').style.display = 'table';
        }

        function updateCharts(coins) {
            const top7 = coins.slice(0, 7);
            
            if (marketCapChart) {
                marketCapChart.destroy();
            }
            
            const ctx1 = document.getElementById('marketCapChart').getContext('2d');
            marketCapChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: top7.map(c => c.symbol.toUpperCase()),
                    datasets: [{
                        label: 'Market Cap',
                        data: top7.map(c => c.market_cap),
                        backgroundColor: [
                            '#f7931a',
                            '#627eea',
                            '#26a17b',
                            '#3c3c3d',
                            '#f3ba2f',
                            '#5468ff',
                            '#ff6384'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatNumber(value, currentCurrency);
                                },
                                color: '#9ca3af'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#9ca3af'
                            },
                            grid: {
                                color: '#374151'
                            }
                        }
                    }
                }
            });
            
            if (volumeChart) {
                volumeChart.destroy();
            }
            
            const ctx2 = document.getElementById('volumeChart').getContext('2d');
            volumeChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: top7.map(c => c.symbol.toUpperCase()),
                    datasets: [{
                        data: top7.map(c => c.total_volume),
                        backgroundColor: [
                            '#f7931a',
                            '#627eea',
                            '#26a17b',
                            '#3c3c3d',
                            '#f3ba2f',
                            '#5468ff',
                            '#ff6384'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#9ca3af'
                            }
                        }
                    }
                }
            });
        }

        initDashboard();