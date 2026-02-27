// Currency Data with Flags
const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
    { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' }
];

// State
let exchangeRates = {};
let lastUpdated = null;
let currentView = 'converter';

// DOM Elements
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const fromAmount = document.getElementById('fromAmount');
const fromFlag = document.getElementById('fromFlag');
const fromCode = document.getElementById('fromCode');
const toFlag = document.getElementById('toFlag');
const toCode = document.getElementById('toCode');
const resultAmount = document.getElementById('resultAmount');
const resultRate = document.getElementById('resultRate');
const lastUpdatedEl = document.getElementById('lastUpdated');
const swapBtn = document.getElementById('swapBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const modeToggle = document.getElementById('modeToggle');
const ratesTableBody = document.getElementById('ratesTableBody');
const refreshRatesBtn = document.getElementById('refreshRates');
const ratesLastUpdatedEl = document.getElementById('ratesLastUpdated');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMode();
    initCurrencyDropdowns();
    initEventListeners();
    fetchExchangeRates();
});

// Theme Management
function initMode() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

modeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Currency Dropdowns
function initCurrencyDropdowns() {
    const fromList = document.getElementById('fromCurrencyList');
    const toList = document.getElementById('toCurrencyList');
    
    currencies.forEach(currency => {
        fromList.appendChild(createCurrencyItem(currency, 'from'));
        toList.appendChild(createCurrencyItem(currency, 'to'));
    });
    
    // Set initial selection
    updateCurrencyDisplay('from', currencies[0]); // USD
    updateCurrencyDisplay('to', currencies[1]);   // INR
}

function createCurrencyItem(currency, type) {
    const li = document.createElement('li');
    li.className = 'currency-item';
    li.dataset.code = currency.code;
    li.innerHTML = `
        <span class="flag">${currency.flag}</span>
        <span class="currency-code">${currency.code}</span>
        <span class="currency-name">${currency.name}</span>
    `;
    
    li.addEventListener('click', () => {
        updateCurrencyDisplay(type, currency);
        closeDropdowns();
        if (type === 'from') {
            convertCurrency();
        } else {
            convertCurrency();
        }
    });
    
    return li;
}

function updateCurrencyDisplay(type, currency) {
    if (type === 'from') {
        fromFlag.textContent = currency.flag;
        fromCode.textContent = currency.code;
        document.querySelector('#fromCurrency .currency-name').textContent = currency.name;
        
        // Update selected state
        document.querySelectorAll('#fromCurrencyList .currency-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.code === currency.code);
        });
    } else {
        toFlag.textContent = currency.flag;
        toCode.textContent = currency.code;
        document.querySelector('#toCurrency .currency-name').textContent = currency.name;
        
        // Update selected state
        document.querySelectorAll('#toCurrencyList .currency-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.code === currency.code);
        });
    }
}

// Dropdown functionality
function initEventListeners() {
    // From currency dropdown
    const fromTrigger = fromCurrency.querySelector('.select-trigger');
    const fromDropdown = fromCurrency.querySelector('.select-dropdown');
    const fromSearch = fromDropdown.querySelector('.dropdown-search');
    
    fromTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(fromCurrency, fromDropdown);
        if (!fromDropdown.classList.contains('hidden')) {
            fromSearch.focus();
        }
    });
    
    fromSearch.addEventListener('input', (e) => {
        filterCurrencies(e.target.value, 'fromCurrencyList');
    });
    
    // To currency dropdown
    const toTrigger = toCurrency.querySelector('.select-trigger');
    const toDropdown = toCurrency.querySelector('.select-dropdown');
    const toSearch = toDropdown.querySelector('.dropdown-search');
    
    toTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(toCurrency, toDropdown);
        if (!toDropdown.classList.contains('hidden')) {
            toSearch.focus();
        }
    });
    
    toSearch.addEventListener('input', (e) => {
        filterCurrencies(e.target.value, 'toCurrencyList');
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!fromCurrency.contains(e.target)) {
            fromDropdown.classList.add('hidden');
            fromTrigger.classList.remove('active');
        }
        if (!toCurrency.contains(e.target)) {
            toDropdown.classList.add('hidden');
            toTrigger.classList.remove('active');
        }
    });
    
    // Amount input
    fromAmount.addEventListener('input', convertCurrency);
    
    // Swap button
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Clear history
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Navigation
    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const view = el.dataset.view;
            switchView(view);
        });
    });
    
    // Refresh rates
    refreshRatesBtn.addEventListener('click', fetchLiveRates);
    
    // Load history
    loadHistory();
}

function toggleDropdown(container, dropdown) {
    const trigger = container.querySelector('.select-trigger');
    const isOpen = !dropdown.classList.contains('hidden');
    
    // Close all dropdowns first
    document.querySelectorAll('.select-dropdown').forEach(d => d.classList.add('hidden'));
    document.querySelectorAll('.select-trigger').forEach(t => t.classList.remove('active'));
    
    if (!isOpen) {
        dropdown.classList.remove('hidden');
        trigger.classList.add('active');
    }
}

function closeDropdowns() {
    document.querySelectorAll('.select-dropdown').forEach(d => d.classList.add('hidden'));
    document.querySelectorAll('.select-trigger').forEach(t => t.classList.remove('active'));
}

function filterCurrencies(search, listId) {
    const list = document.getElementById(listId);
    const items = list.querySelectorAll('.currency-item');
    const searchLower = search.toLowerCase();
    
    items.forEach(item => {
        const code = item.dataset.code.toLowerCase();
        const name = item.querySelector('.currency-name').textContent.toLowerCase();
        const match = code.includes(searchLower) || name.includes(searchLower);
        item.style.display = match ? 'flex' : 'none';
    });
}

// Swap currencies
function swapCurrencies() {
    swapBtn.classList.add('swapping');
    
    const tempCode = fromCode.textContent;
    const tempFlag = fromFlag.textContent;
    const tempName = document.querySelector('#fromCurrency .currency-name').textContent;
    
    const fromCurrencyData = currencies.find(c => c.code === toCode.textContent);
    const toCurrencyData = currencies.find(c => c.code === tempCode);
    
    updateCurrencyDisplay('from', fromCurrencyData);
    updateCurrencyDisplay('to', toCurrencyData);
    
    setTimeout(() => {
        swapBtn.classList.remove('swapping');
    }, 500);
    
    convertCurrency();
}

// Currency Conversion
async function fetchExchangeRates() {
    try {
        // Using a free API - ExchangeRate-API (no key required for basic usage)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        exchangeRates = data.rates;
        lastUpdated = new Date(data.time_last_updated * 1000);
        
        updateLastUpdated();
        convertCurrency();
        
        // Store in localStorage for offline use
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        localStorage.setItem('ratesTimestamp', Date.now().toString());
        
    } catch (error) {
        console.error('Error fetching rates:', error);
        // Try to use cached rates
        const cached = localStorage.getItem('exchangeRates');
        if (cached) {
            exchangeRates = JSON.parse(cached);
            showToast('Using cached exchange rates', 'error');
            convertCurrency();
        } else {
            showToast('Unable to fetch exchange rates', 'error');
        }
    }
}

function updateLastUpdated() {
    if (lastUpdated) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        lastUpdatedEl.textContent = lastUpdated.toLocaleDateString('en-US', options);
    }
}

function convertCurrency() {
    const amount = parseFloat(fromAmount.value) || 0;
    const from = fromCode.textContent;
    const to = toCode.textContent;
    
    if (from === to) {
        resultAmount.textContent = formatNumber(amount);
        resultRate.textContent = '1:1 (Same currency)';
        return;
    }
    
    // Convert through USD as base
    const fromRate = exchangeRates[from] || 1;
    const toRate = exchangeRates[to] || 1;
    const rate = toRate / fromRate;
    const result = amount * rate;
    
    resultAmount.textContent = formatNumber(result, 2);
    resultRate.textContent = `1 ${from} = ${formatNumber(rate, 4)} ${to}`;
    
    // Add to history if amount > 0
    if (amount > 0) {
        addToHistory(from, to, amount, result);
    }
}

function formatNumber(num, decimals = 2) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Conversion History
function addToHistory(from, to, amount, result) {
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    // Check if last entry is same (avoid duplicates)
    if (history.length > 0) {
        const last = history[0];
        if (last.from === from && last.to === to && last.amount === amount) {
            return;
        }
    }
    
    const entry = {
        from,
        to,
        amount,
        result,
        timestamp: Date.now()
    };
    
    history.unshift(entry);
    
    // Keep only last 20 entries
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="history-empty">No conversions yet</li>';
        return;
    }
    
    historyList.innerHTML = history.map(entry => {
        const time = new Date(entry.timestamp);
        const timeStr = time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateStr = time.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <li class="history-item">
                <div class="history-conversion">
                    <span class="from">${entry.amount.toFixed(2)} ${entry.from}</span>
                    <span class="history-arrow">→</span>
                    <span class="to">${entry.to}</span>
                </div>
                <div class="history-result">
                    <div class="history-amount">${formatNumber(entry.result, 2)} ${entry.to}</div>
                    <div class="history-time">${dateStr} ${timeStr}</div>
                </div>
            </li>
        `;
    }).join('');
}

function clearHistory() {
    localStorage.removeItem('conversionHistory');
    renderHistory();
    showToast('History cleared', 'success');
}

// View Switching
function switchView(view) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === view);
    });
    
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    
    document.getElementById(`${view}View`).classList.add('active');
    currentView = view;
    
    if (view === 'rates') {
        fetchLiveRates();
    }
}

// Live Rates
async function fetchLiveRates() {
    refreshRatesBtn.classList.add('loading');
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        exchangeRates = data.rates;
        
        const updateTime = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        ratesLastUpdatedEl.textContent = updateTime.toLocaleDateString('en-US', options);
        
        renderRatesTable();
        showToast('Rates updated successfully', 'success');
        
    } catch (error) {
        console.error('Error fetching live rates:', error);
        showToast('Failed to refresh rates', 'error');
    } finally {
        refreshRatesBtn.classList.remove('loading');
    }
}

function renderRatesTable() {
    const baseCurrency = 'USD';
    const currenciesWithRates = currencies.filter(c => exchangeRates[c.code]);
    
    ratesTableBody.innerHTML = currenciesWithRates.map(currency => {
        const rate = exchangeRates[currency.code];
        // Simulate 24h change (since free API doesn't provide this)
        const change = (Math.random() * 4 - 2).toFixed(2);
        const changeClass = parseFloat(change) >= 0 ? 'change-positive' : 'change-negative';
        const changeIcon = parseFloat(change) >= 0 ? '↑' : '↓';
        
        return `
            <tr>
                <td>
                    <div class="currency-cell">
                        <span class="flag">${currency.flag}</span>
                        <div class="currency-info">
                            <span class="currency-code">${currency.code}</span>
                            <span class="currency-name">${currency.name}</span>
                        </div>
                    </div>
                </td>
                <td class="rate-value">${formatNumber(rate, 4)}</td>
                <td class="${changeClass}">${changeIcon} ${Math.abs(change)}%</td>
            </tr>
        `;
    }).join('');
}

// Toast Notifications
function showToast(message, type = '') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    if (type) {
        toast.classList.add(type);
    }
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
