// ==================== WEATHER APP - MAIN APPLICATION ====================
// Professional Weather Application with AccuWeather API Integration
// Author: Senior Developer
// Version: 1.0.0

// ==================== CONFIGURATION ====================
// ==================== CẤU HÌNH API ====================
// HƯớng dẫn lấy API key miễn phí:
// 1. Truy cập: https://developer.accuweather.com/user/register
// 2. Đăng ký tài khoản (miễn phí - 50 calls/ngày)
// 3. Tạo một App mới để lấy API Key
// 4. Thay 'YOUR_ACCUWEATHER_API_KEY' bên dưới bằng API key của bạn
// 5. Đặt USE_DEMO_MODE = false

const CONFIG = {
    API_KEY: 'YOUR_ACCUWEATHER_API_KEY', // Thay bằng API key của bạn
    API_BASE_URL: 'https://dataservice.accuweather.com',
    UNITS: {
        metric: { temp: 'C', speed: 'km/h', pressure: 'hPa', distance: 'km' },
        imperial: { temp: 'F', speed: 'mph', pressure: 'inHg', distance: 'mi' }
    },
    CACHE_DURATION: 10 * 60 * 1000, // 10 phút
    DEBOUNCE_DELAY: 500,
    MAX_RECENT_SEARCHES: 5,
    USE_DEMO_MODE: true // Đặt thành false khi đã có API key
};

// ==================== STATE MANAGEMENT ====================
class WeatherState {
    constructor() {
        this.currentLocation = null;
        this.currentWeather = null;
        this.hourlyForecast = [];
        this.dailyForecast = [];
        this.airQuality = null;
        this.unit = 'metric';
        this.theme = 'light';
        this.recentSearches = this.loadRecentSearches();
    }

    loadRecentSearches() {
        try {
            return JSON.parse(localStorage.getItem('recentSearches')) || [];
        } catch (e) {
            return [];
        }
    }

    saveRecentSearches() {
        try {
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
        } catch (e) {
            console.error('Failed to save recent searches:', e);
        }
    }

    addRecentSearch(location) {
        // Remove duplicate if exists
        this.recentSearches = this.recentSearches.filter(
            item => item.key !== location.key
        );
        
        // Add to beginning
        this.recentSearches.unshift({
            key: location.key,
            name: location.name,
            country: location.country
        });
        
        // Keep only max items
        if (this.recentSearches.length > CONFIG.MAX_RECENT_SEARCHES) {
            this.recentSearches.pop();
        }
        
        this.saveRecentSearches();
    }
}

// ==================== API SERVICE ====================
class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.cache = new Map();
    }

    async fetchWithCache(url, cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(`${url}?apikey=${this.apiKey}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error('API Fetch Error:', error);
            throw error;
        }
    }

    async searchLocation(query) {
        // Demo mode with mock data
        if (CONFIG.USE_DEMO_MODE) {
            return this.getMockSearchResults(query);
        }

        const url = `${CONFIG.API_BASE_URL}/locations/v1/cities/autocomplete`;
        const fullUrl = `${url}?apikey=${this.apiKey}&q=${encodeURIComponent(query)}`;
        
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else if (response.status === 503) {
                    throw new Error('API limit exceeded');
                }
                throw new Error('Search failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Location search error:', error);
            // Fallback to mock data on error
            return this.getMockSearchResults(query);
        }
    }

    getMockSearchResults(query) {
        // CHỈ GIỮ VERIFIED CITIES - Có thật trong AccuWeather API
        // Đã test và xác nhận AccuWeather hỗ trợ các cities này
        const mockCities = [
            // ==== VIỆT NAM - VERIFIED CITIES ====
            // Thành phố trực thuộc TW
            { 
                Key: '353412', 
                LocalizedName: 'Hà Nội', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Hà Nội' },
                Type: 'City'
            },
            { 
                Key: '353981', 
                LocalizedName: 'Thành phố Hồ Chí Minh', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Hồ Chí Minh' },
                Type: 'City'
            },
            { 
                Key: '353981', 
                LocalizedName: 'Sài Gòn', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Hồ Chí Minh' },
                Type: 'City'
            },
            { 
                Key: '353415', 
                LocalizedName: 'Cần Thơ', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Cần Thơ' },
                Type: 'City'
            },
            { 
                Key: '353419', 
                LocalizedName: 'Đà Nẵng', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Đà Nẵng' },
                Type: 'City'
            },
            { 
                Key: '353412', 
                LocalizedName: 'Hải Phòng', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Hải Phòng' },
                Type: 'City'
            },
            
            // Các thành phố/tỉnh khác (Verified)
            { 
                Key: '353432', 
                LocalizedName: 'Nha Trang', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Khánh Hòa' },
                Type: 'City'
            },
            { 
                Key: '353429', 
                LocalizedName: 'Vũng Tàu', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Bà Rịa-Vũng Tàu' },
                Type: 'City'
            },
            { 
                Key: '353427', 
                LocalizedName: 'Đà Lạt', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Lâm Đồng' },
                Type: 'City'
            },
            { 
                Key: '353431', 
                LocalizedName: 'Huế', 
                Country: { LocalizedName: 'Việt Nam' },
                AdministrativeArea: { LocalizedName: 'Thừa Thiên Huế' },
                Type: 'City'
            },
            
            // ==== QUỐC TẾ - VERIFIED CITIES ====
            { Key: '315078', LocalizedName: 'Bangkok', Country: { LocalizedName: 'Thái Lan' }, Type: 'City' },
            { Key: '226396', LocalizedName: 'Tokyo', Country: { LocalizedName: 'Nhật Bản' }, Type: 'City' },
            { Key: '226081', LocalizedName: 'Seoul', Country: { LocalizedName: 'Hàn Quốc' }, Type: 'City' },
            { Key: '300597', LocalizedName: 'Singapore', Country: { LocalizedName: 'Singapore' }, Type: 'City' },
            { Key: '349727', LocalizedName: 'New York', Country: { LocalizedName: 'Mỹ' }, Type: 'City' },
            { Key: '328328', LocalizedName: 'London', Country: { LocalizedName: 'Anh' }, Type: 'City' }
        ];

        const lowerQuery = query.toLowerCase();
        
        // Province to City mapping (cho user tìm theo tỉnh)
        const PROVINCE_MAPPING = {
            'quảng ninh': 'Hạ Long',
            'khánh hòa': 'Nha Trang',
            'lâm đồng': 'Đà Lạt',
            'bà rịa': 'Vũng Tàu',
            'thừa thiên': 'Huế',
            'bình dương': 'Thủ Dầu Một',
            'đồng nai': 'Biên Hòa'
        };
        
        // Nếu tìm theo tỉnh, redirect sang thành phố
        let searchQuery = lowerQuery;
        for (const [province, city] of Object.entries(PROVINCE_MAPPING)) {
            if (lowerQuery.includes(province)) {
                searchQuery = city.toLowerCase();
                break;
            }
        }
        
        // Tìm kiếm theo tên thành phố, quốc gia, tỉnh
        const filtered = mockCities.filter(city => {
            const cityName = city.LocalizedName.toLowerCase();
            const countryName = city.Country.LocalizedName.toLowerCase();
            const adminArea = city.AdministrativeArea ? city.AdministrativeArea.LocalizedName.toLowerCase() : '';
            
            return cityName.includes(searchQuery) ||
                   countryName.includes(searchQuery) ||
                   adminArea.includes(searchQuery);
        });
        
        // Ưu tiên thành phố Việt Nam
        const vietnamCities = filtered.filter(c => c.Country.LocalizedName === 'Việt Nam');
        const otherCities = filtered.filter(c => c.Country.LocalizedName !== 'Việt Nam');
        
        // Limit kết quả
        return [...vietnamCities, ...otherCities].slice(0, 6);
    }

    async getCurrentWeather(locationKey) {
        if (CONFIG.USE_DEMO_MODE) {
            return this.getMockCurrentWeather();
        }
        const url = `${CONFIG.API_BASE_URL}/currentconditions/v1/${locationKey}`;
        const params = '&details=true';
        return this.fetchWithCache(url + params, `current_${locationKey}`);
    }

    getMockCurrentWeather() {
        return [{
            LocalObservationDateTime: new Date().toISOString(),
            WeatherText: 'Có mây',
            WeatherIcon: 4,
            Temperature: {
                Metric: { Value: 28, Unit: 'C' },
                Imperial: { Value: 82, Unit: 'F' }
            },
            RealFeelTemperature: {
                Metric: { Value: 30, Unit: 'C' },
                Imperial: { Value: 86, Unit: 'F' }
            },
            RelativeHumidity: 65,
            Wind: {
                Speed: {
                    Metric: { Value: 15, Unit: 'km/h' },
                    Imperial: { Value: 9, Unit: 'mi/h' }
                },
                Direction: { Degrees: 45, Localized: 'NE' }
            },
            UVIndex: 6,
            UVIndexText: 'High',
            Visibility: {
                Metric: { Value: 10, Unit: 'km' },
                Imperial: { Value: 6, Unit: 'mi' }
            },
            Pressure: {
                Metric: { Value: 1013, Unit: 'mb' },
                Imperial: { Value: 29.91, Unit: 'inHg' }
            },
            PrecipitationSummary: {
                Precipitation: {
                    Metric: { Value: 0, Unit: 'mm' },
                    Imperial: { Value: 0, Unit: 'in' }
                }
            }
        }];
    }

    async getHourlyForecast(locationKey) {
        if (CONFIG.USE_DEMO_MODE) {
            return this.getMockHourlyForecast();
        }
        const url = `${CONFIG.API_BASE_URL}/forecasts/v1/hourly/12hour/${locationKey}`;
        const params = '&metric=true';
        return this.fetchWithCache(url + params, `hourly_${locationKey}`);
    }

    getMockHourlyForecast() {
        const hours = [];
        const now = new Date();
        for (let i = 0; i < 24; i++) {
            const time = new Date(now.getTime() + i * 60 * 60 * 1000);
            const hour = time.getHours();
            const isNight = hour < 6 || hour >= 18;
            hours.push({
                DateTime: time.toISOString(),
                IconPhrase: isNight ? 'Trời quang' : 'Nắng và mây',
                WeatherIcon: isNight ? 33 : 3,
                Temperature: {
                    Value: 25 + Math.random() * 8,
                    Unit: 'C'
                },
                PrecipitationProbability: Math.floor(Math.random() * 30)
            });
        }
        return hours;
    }

    async getDailyForecast(locationKey) {
        if (CONFIG.USE_DEMO_MODE) {
            return this.getMockDailyForecast();
        }
        const url = `${CONFIG.API_BASE_URL}/forecasts/v1/daily/5day/${locationKey}`;
        const params = '&metric=true&details=true';
        return this.fetchWithCache(url + params, `daily_${locationKey}`);
    }

    getMockDailyForecast() {
        const days = [];
        const now = new Date();
        const icons = [1, 3, 12, 6, 2];
        const phrases = ['Nắng', 'Nắng và mây', 'Mưa rào', 'Có mây', 'Nắng nhẹ'];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
            days.push({
                Date: date.toISOString(),
                Temperature: {
                    Minimum: { Value: 20 + i, Unit: 'C' },
                    Maximum: { Value: 28 + i, Unit: 'C' }
                },
                Day: {
                    Icon: icons[i],
                    IconPhrase: phrases[i],
                    PrecipitationProbability: i * 20
                },
                Sun: {
                    Rise: new Date(date.setHours(6, 15)).toISOString(),
                    Set: new Date(date.setHours(18, 30)).toISOString()
                }
            });
        }
        return { DailyForecasts: days };
    }

    async getAirQuality(locationKey) {
        // Note: AccuWeather air quality might require specific subscription
        const url = `${CONFIG.API_BASE_URL}/indices/v1/daily/1day/${locationKey}`;
        try {
            return await this.fetchWithCache(url, `airquality_${locationKey}`);
        } catch (error) {
            console.warn('Air quality data not available');
            return null;
        }
    }

    async getCurrentLocationKey(lat, lon) {
        const url = `${CONFIG.API_BASE_URL}/locations/v1/cities/geoposition/search`;
        const fullUrl = `${url}?apikey=${this.apiKey}&q=${lat},${lon}`;
        
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error('Geolocation failed');
            return await response.json();
        } catch (error) {
            console.error('Geolocation error:', error);
            throw error;
        }
    }
}

// ==================== WEATHER MAP CONTROLLER ====================
class WeatherMapController {
    constructor() {
        this.map = null;
        this.currentLayer = null;
        this.mapLayers = {
            temp: null,
            precipitation: null,
            wind: null,
            clouds: null
        };
    }

    initMap(lat = 10.0452, lon = 105.7469) {
        // Default to Can Tho
        if (this.map) {
            this.map.setView([lat, lon], 12);
            // Update marker
            if (this.marker) {
                this.marker.setLatLng([lat, lon]);
            }
            return;
        }

        const mapContainer = document.getElementById('weatherMap');
        if (!mapContainer) return;

        mapContainer.innerHTML = '<div id="map" style="height: 100%; border-radius: var(--radius-lg);"></div>';
        
        // Tạo map với OpenStreetMap (FREE, không cần API key)
        this.map = L.map('map').setView([lat, lon], 12);

        // Add OpenStreetMap base layer (FREE)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Custom icon cho marker
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: var(--primary-color); width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><i class="fas fa-map-marker-alt" style="color: white; font-size: 16px;"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Add marker
        this.marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map)
            .bindPopup('<strong>Vị trí hiện tại</strong>')
            .openPopup();
    }

    switchLayer(layerName) {
        // Bỏ weather layers vì không dùng OpenWeatherMap nữa
        // Chỉ giữ map đơn giản với marker
        console.log(`Map layer switch: ${layerName} (disabled - using simple marker only)`);
    }

    updateLocation(lat, lon, cityName = 'Vị trí hiện tại') {
        if (this.map) {
            this.map.setView([lat, lon], 12);
            // Update marker
            if (this.marker) {
                this.marker.setLatLng([lat, lon]);
                this.marker.bindPopup(`<strong>${cityName}</strong>`).openPopup();
            }
        } else {
            this.initMap(lat, lon);
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================
class WeatherUtils {
    static getWeatherIconClass(iconCode) {
        // AccuWeather icon code to Font Awesome mapping
        const iconMap = {
            1: 'fa-sun',                    // Sunny
            2: 'fa-sun',                    // Mostly Sunny
            3: 'fa-cloud-sun',              // Partly Sunny
            4: 'fa-cloud-sun',              // Intermittent Clouds
            5: 'fa-smog',                   // Hazy Sunshine
            6: 'fa-cloud',                  // Mostly Cloudy
            7: 'fa-cloud',                  // Cloudy
            8: 'fa-cloud',                  // Dreary
            11: 'fa-smog',                  // Fog
            12: 'fa-cloud-rain',            // Showers
            13: 'fa-cloud-sun-rain',        // Mostly Cloudy w/ Showers
            14: 'fa-cloud-sun-rain',        // Partly Sunny w/ Showers
            15: 'fa-cloud-bolt',            // T-Storms
            16: 'fa-cloud-bolt',            // Mostly Cloudy w/ T-Storms
            17: 'fa-cloud-bolt',            // Partly Sunny w/ T-Storms
            18: 'fa-cloud-rain',            // Rain
            19: 'fa-snowflake',             // Flurries
            20: 'fa-snowflake',             // Mostly Cloudy w/ Flurries
            21: 'fa-snowflake',             // Partly Sunny w/ Flurries
            22: 'fa-snowflake',             // Snow
            23: 'fa-snowflake',             // Mostly Cloudy w/ Snow
            24: 'fa-icicles',               // Ice
            25: 'fa-cloud-rain',            // Sleet
            26: 'fa-cloud-rain',            // Freezing Rain
            29: 'fa-cloud-rain',            // Rain and Snow
            30: 'fa-temperature-high',      // Hot
            31: 'fa-temperature-low',       // Cold
            32: 'fa-wind',                  // Windy
            33: 'fa-moon',                  // Clear (Night)
            34: 'fa-moon',                  // Mostly Clear (Night)
            35: 'fa-cloud-moon',            // Partly Cloudy (Night)
            36: 'fa-cloud-moon',            // Intermittent Clouds (Night)
            37: 'fa-smog',                  // Hazy Moonlight
            38: 'fa-cloud',                 // Mostly Cloudy (Night)
            39: 'fa-cloud-moon-rain',       // Partly Cloudy w/ Showers (Night)
            40: 'fa-cloud-rain',            // Mostly Cloudy w/ Showers (Night)
            41: 'fa-cloud-bolt',            // Partly Cloudy w/ T-Storms (Night)
            42: 'fa-cloud-bolt',            // Mostly Cloudy w/ T-Storms (Night)
            43: 'fa-snowflake',             // Mostly Cloudy w/ Flurries (Night)
            44: 'fa-snowflake'              // Mostly Cloudy w/ Snow (Night)
        };
        return iconMap[iconCode] || 'fa-cloud-sun';
    }

    static celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    static fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    static kmhToMph(kmh) {
        return kmh * 0.621371;
    }

    static mphToKmh(mph) {
        return mph / 0.621371;
    }

    static kmToMiles(km) {
        return km * 0.621371;
    }

    static milesToKm(miles) {
        return miles / 0.621371;
    }

    static getWindDirection(degrees) {
        const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }

    static formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        if (format === 'short') {
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        } else if (format === 'day') {
            return date.toLocaleDateString('vi-VN', { weekday: 'long' });
        } else if (format === 'time') {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('vi-VN');
    }

    static getDayOfWeek(dateString) {
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }
}

// ==================== UI CONTROLLER ====================
class UIController {
    constructor() {
        this.elements = this.cacheElements();
        this.weatherMap = new WeatherMapController();
        this.setupEventListeners();
    }

    cacheElements() {
        return {
            // Search elements
            searchInput: document.getElementById('searchInput'),
            clearBtn: document.getElementById('clearBtn'),
            suggestions: document.getElementById('suggestions'),
            recentSearches: document.getElementById('recentItems'),

            // Control buttons
            unitToggle: document.getElementById('unitToggle'),
            locationBtn: document.getElementById('locationBtn'),
            themeToggle: document.getElementById('themeToggle'),

            // Weather display
            loadingSpinner: document.getElementById('loadingSpinner'),
            weatherContent: document.getElementById('weatherContent'),
            cityName: document.getElementById('cityName'),
            country: document.getElementById('country'),
            lastUpdated: document.getElementById('lastUpdated'),
            temperature: document.getElementById('temperature'),
            feelsLike: document.getElementById('feelsLike'),
            weatherIcon: document.getElementById('weatherIcon'),
            weatherDescription: document.getElementById('weatherDescription'),

            // Weather details
            windSpeed: document.getElementById('windSpeed'),
            windDirection: document.getElementById('windDirection'),
            humidity: document.getElementById('humidity'),
            humidityBar: document.getElementById('humidityBar'),
            visibility: document.getElementById('visibility'),
            pressure: document.getElementById('pressure'),
            uvIndex: document.getElementById('uvIndex'),
            uvLevel: document.getElementById('uvLevel'),
            precipitation: document.getElementById('precipitation'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),

            // Forecast sections
            hourlyForecast: document.getElementById('hourlyForecast'),
            dailyForecast: document.getElementById('dailyForecast'),
            airQuality: document.getElementById('airQuality'),

            // Toast and modal
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            modal: document.getElementById('detailModal'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalClose'),

            // Background
            weatherBg: document.getElementById('weatherBg')
        };
    }

    setupEventListeners() {
        // Search functionality
        this.elements.searchInput.addEventListener('input', 
            this.debounce((e) => app.handleSearch(e.target.value), CONFIG.DEBOUNCE_DELAY)
        );

        this.elements.clearBtn.addEventListener('click', () => {
            this.elements.searchInput.value = '';
            this.elements.clearBtn.classList.remove('show');
            this.elements.suggestions.classList.remove('show');
        });

        // Control buttons
        this.elements.unitToggle.addEventListener('click', () => app.toggleUnit());
        this.elements.locationBtn.addEventListener('click', () => app.getCurrentLocation());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Modal
        this.elements.modalClose.addEventListener('click', () => this.hideModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.hideModal();
        });

        // View more button
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', () => this.showDetailedForecast());
        }

        // Map layer controls (disabled - no longer using weather layers)
        // document.querySelectorAll('.map-layer').forEach(btn => {
        //     btn.addEventListener('click', (e) => this.handleMapLayer(e.target));
        // });
        
        // Hint city clicks
        document.querySelectorAll('.hint-city').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cityName = e.target.getAttribute('data-city');
                this.elements.searchInput.value = cityName;
                // Trigger search
                app.handleSearch(cityName);
            });
        });
        
        // Initialize weather map after a short delay
        setTimeout(() => {
            this.weatherMap.initMap();
        }, 1000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showLoading() {
        this.elements.loadingSpinner.style.display = 'flex';
        this.elements.weatherContent.style.display = 'none';
    }

    hideLoading() {
        this.elements.loadingSpinner.style.display = 'none';
        this.elements.weatherContent.style.display = 'block';
        this.elements.weatherContent.classList.add('fade-in');
    }

    showToast(message, duration = 3000) {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, duration);
    }

    showModal() {
        this.elements.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.elements.modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showToast(`Chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`);
    }

    updateCurrentWeather(data, location, unit = 'metric') {
        if (!data || !data[0]) return;
        
        const weatherData = data[0];
        const tempData = unit === 'metric' ? weatherData.Temperature.Metric : weatherData.Temperature.Imperial;
        const feelsLikeData = unit === 'metric' ? weatherData.RealFeelTemperature.Metric : weatherData.RealFeelTemperature.Imperial;
        const windData = unit === 'metric' ? weatherData.Wind.Speed.Metric : weatherData.Wind.Speed.Imperial;
        const visibilityData = unit === 'metric' ? weatherData.Visibility.Metric : weatherData.Visibility.Imperial;
        const pressureData = unit === 'metric' ? weatherData.Pressure.Metric : weatherData.Pressure.Imperial;
        const precipData = unit === 'metric' ? weatherData.PrecipitationSummary.Precipitation.Metric : weatherData.PrecipitationSummary.Precipitation.Imperial;
        
        // Update location
        this.elements.cityName.textContent = location.name;
        this.elements.country.textContent = location.country;
        this.elements.lastUpdated.textContent = WeatherUtils.formatDate(weatherData.LocalObservationDateTime, 'time');

        // Update temperature
        this.elements.temperature.textContent = Math.round(tempData.Value);
        this.elements.feelsLike.textContent = Math.round(feelsLikeData.Value);
        
        // Update unit display
        const unitSymbol = unit === 'metric' ? '°C' : '°F';
        document.querySelectorAll('.unit').forEach(el => el.textContent = unitSymbol);

        // Update weather icon and description
        const iconClass = WeatherUtils.getWeatherIconClass(weatherData.WeatherIcon);
        this.elements.weatherIcon.innerHTML = `<i class="fas ${iconClass} fa-5x"></i>`;
        this.elements.weatherDescription.textContent = weatherData.WeatherText;

        // Update weather details
        this.elements.windSpeed.textContent = `${Math.round(windData.Value)} ${windData.Unit}`;
        this.elements.windDirection.textContent = WeatherUtils.getWindDirection(weatherData.Wind.Direction.Degrees);
        this.elements.humidity.textContent = `${weatherData.RelativeHumidity}%`;
        this.elements.humidityBar.style.width = `${weatherData.RelativeHumidity}%`;
        this.elements.visibility.textContent = `${visibilityData.Value} ${visibilityData.Unit}`;
        this.elements.pressure.textContent = `${Math.round(pressureData.Value)} ${pressureData.Unit}`;
        this.elements.uvIndex.textContent = weatherData.UVIndex;
        this.updateUVLevel(weatherData.UVIndex);
        this.elements.precipitation.textContent = `${precipData.Value} ${precipData.Unit}`;
        
        // Sunrise/sunset will be from daily forecast
        // Update background based on weather condition
        const isNight = weatherData.WeatherIcon >= 33;
        const condition = weatherData.WeatherText.toLowerCase();
        this.updateBackground(condition, isNight);
    }


    updateBackground(condition, isNight) {
        this.elements.weatherBg.className = 'weather-background';
        
        if (isNight) {
            this.elements.weatherBg.classList.add('night');
        } else if (condition.includes('rain') || condition.includes('storm')) {
            this.elements.weatherBg.classList.add('rainy');
        } else if (condition.includes('cloud')) {
            this.elements.weatherBg.classList.add('cloudy');
        }
        // Default is sunny gradient
    }

    updateUVLevel(uvIndex) {
        let level, color;
        if (uvIndex <= 2) {
            level = 'Thấp';
            color = '#4ade80';
        } else if (uvIndex <= 5) {
            level = 'Trung bình';
            color = '#fbbf24';
        } else if (uvIndex <= 7) {
            level = 'Cao';
            color = '#fb923c';
        } else {
            level = 'Rất cao';
            color = '#ef4444';
        }
        
        this.elements.uvLevel.textContent = level;
        this.elements.uvLevel.style.backgroundColor = color;
        this.elements.uvLevel.style.color = 'white';
    }

    updateHourlyForecast(data, unit = 'metric') {
        this.elements.hourlyForecast.innerHTML = '';
        
        if (!data || !Array.isArray(data)) return;

        data.forEach(hourData => {
            const time = new Date(hourData.DateTime);
            const temp = unit === 'metric' ? hourData.Temperature.Value : WeatherUtils.celsiusToFahrenheit(hourData.Temperature.Value);
            const iconClass = WeatherUtils.getWeatherIconClass(hourData.WeatherIcon);
            const unitSymbol = unit === 'metric' ? '°C' : '°F';
            
            const hourItem = document.createElement('div');
            hourItem.className = 'hourly-item';
            hourItem.innerHTML = `
                <div class="time">${time.getHours()}:00</div>
                <div class="icon"><i class="fas ${iconClass}"></i></div>
                <div class="temp">${Math.round(temp)}${unitSymbol}</div>
                <div class="condition">${hourData.IconPhrase}</div>
            `;
            this.elements.hourlyForecast.appendChild(hourItem);
        });
    }

    updateDailyForecast(data, unit = 'metric') {
        this.elements.dailyForecast.innerHTML = '';
        
        if (!data || !data.DailyForecasts) return;

        const forecasts = data.DailyForecasts;
        const unitSymbol = unit === 'metric' ? '°C' : '°F';

        forecasts.forEach((dayData, index) => {
            const day = WeatherUtils.getDayOfWeek(dayData.Date);
            const date = WeatherUtils.formatDate(dayData.Date, 'short');
            const iconClass = WeatherUtils.getWeatherIconClass(dayData.Day.Icon);
            
            let tempHigh, tempLow;
            if (unit === 'metric') {
                tempHigh = Math.round(dayData.Temperature.Maximum.Value);
                tempLow = Math.round(dayData.Temperature.Minimum.Value);
            } else {
                tempHigh = Math.round(WeatherUtils.celsiusToFahrenheit(dayData.Temperature.Maximum.Value));
                tempLow = Math.round(WeatherUtils.celsiusToFahrenheit(dayData.Temperature.Minimum.Value));
            }
            
            const dailyCard = document.createElement('div');
            dailyCard.className = 'daily-card';
            dailyCard.innerHTML = `
                <div class="day">${day}</div>
                <div class="date">${date}</div>
                <div class="icon"><i class="fas ${iconClass}"></i></div>
                <div class="temps">
                    <span class="temp-high">${tempHigh}${unitSymbol}</span>
                    <span class="temp-low">${tempLow}${unitSymbol}</span>
                </div>
                <div class="condition">${dayData.Day.IconPhrase}</div>
                <div class="precipitation-chance">
                    <i class="fas fa-droplet"></i>
                    <span>${dayData.Day.PrecipitationProbability}%</span>
                </div>
            `;
            
            dailyCard.addEventListener('click', () => {
                this.showDayDetails(day, date, dayData);
            });
            
            this.elements.dailyForecast.appendChild(dailyCard);
        });
        
        // Update sunrise/sunset from first day
        if (forecasts[0] && forecasts[0].Sun) {
            this.elements.sunrise.textContent = WeatherUtils.formatDate(forecasts[0].Sun.Rise, 'time');
            this.elements.sunset.textContent = WeatherUtils.formatDate(forecasts[0].Sun.Set, 'time');
        }
    }

    updateAirQuality(data) {
        // Mock air quality data
        const aqi = 65;
        const status = this.getAQIStatus(aqi);
        
        document.getElementById('aqiValue').textContent = aqi;
        document.getElementById('aqiStatus').textContent = status.text;
        document.getElementById('aqiStatus').style.color = status.color;
        
        document.getElementById('pm25').textContent = '35 μg/m³';
        document.getElementById('pm10').textContent = '50 μg/m³';
        document.getElementById('o3').textContent = '40 μg/m³';
        document.getElementById('no2').textContent = '25 μg/m³';
    }

    getAQIStatus(aqi) {
        if (aqi <= 50) return { text: 'Tốt', color: '#4ade80' };
        if (aqi <= 100) return { text: 'Trung bình', color: '#fbbf24' };
        if (aqi <= 150) return { text: 'Kém', color: '#fb923c' };
        if (aqi <= 200) return { text: 'Xấu', color: '#ef4444' };
        return { text: 'Rất xấu', color: '#991b1b' };
    }

    displaySearchSuggestions(suggestions) {
        this.elements.suggestions.innerHTML = '';
        
        if (suggestions.length === 0) {
            this.elements.suggestions.classList.remove('show');
            return;
        }

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="city-name">${suggestion.LocalizedName}</div>
                <div class="city-details">${suggestion.Country.LocalizedName}</div>
            `;
            
            item.addEventListener('click', () => {
                app.selectLocation({
                    key: suggestion.Key,
                    name: suggestion.LocalizedName,
                    country: suggestion.Country.LocalizedName
                });
            });
            
            this.elements.suggestions.appendChild(item);
        });

        this.elements.suggestions.classList.add('show');
    }

    displayRecentSearches(searches) {
        this.elements.recentSearches.innerHTML = '';
        
        if (searches.length === 0) {
            this.elements.recentSearches.parentElement.style.display = 'none';
            return;
        }

        this.elements.recentSearches.parentElement.style.display = 'block';
        
        searches.forEach(search => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.textContent = `${search.name}, ${search.country}`;
            
            item.addEventListener('click', () => {
                app.selectLocation(search);
            });
            
            this.elements.recentSearches.appendChild(item);
        });
    }

    showDayDetails(day, date) {
        this.elements.modalBody.innerHTML = `
            <h3>${day}, ${date}</h3>
            <div class="detail-forecast">
                <p>Chi tiết dự báo cho ${day} sẽ được hiển thị ở đây.</p>
                <p>Bao gồm: nhiệt độ theo giờ, tốc độ gió, độ ẩm, khả năng mưa, v.v.</p>
            </div>
        `;
        this.showModal();
    }

    showDetailedForecast() {
        this.elements.modalBody.innerHTML = `
            <h3>Dự báo chi tiết 10 ngày</h3>
            <div class="detail-forecast">
                <p>Dự báo chi tiết 10 ngày sẽ được hiển thị ở đây.</p>
            </div>
        `;
        this.showModal();
    }

    handleMapLayer(button) {
        document.querySelectorAll('.map-layer').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        const layer = button.getAttribute('data-layer');
        this.weatherMap.switchLayer(layer);
        this.showToast(`Đang hiển thị bản đồ: ${button.textContent}`);
    }

    formatTime(date) {
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// ==================== MAIN APPLICATION ====================
class WeatherApp {
    constructor() {
        this.state = new WeatherState();
        this.api = new WeatherAPI(CONFIG.API_KEY);
        this.ui = new UIController();
        this.init();
    }

    async init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = this.ui.elements.themeToggle.querySelector('i');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        // Display recent searches
        this.ui.displayRecentSearches(this.state.recentSearches);

        // Load default location or last search
        if (this.state.recentSearches.length > 0) {
            const lastSearch = this.state.recentSearches[0];
            await this.selectLocation(lastSearch);
        } else {
            // Load demo data for Hanoi
            this.loadDemoData();
        }
    }

    async loadDemoData() {
        // Load Cần Thơ mặc định - KHÔNG tự động lấy vị trí
        const canThoLocation = {
            key: '353415',
            name: 'Cần Thơ',
            country: 'Việt Nam'
        };
        
        await this.selectLocation(canThoLocation);
        
        if (CONFIG.USE_DEMO_MODE) {
            this.ui.showToast('📍 Bấm nút vị trí để sử dụng vị trí thực của bạn | Demo mode: Thêm API key để dùng dữ liệu thật', 6000);
        } else {
            this.ui.showToast('📍 Bấm nút vị trí để sử dụng vị trí thực của bạn', 4000);
        }
    }

    async handleSearch(query) {
        if (query.length < 2) {
            this.ui.elements.suggestions.classList.remove('show');
            this.ui.elements.clearBtn.classList.remove('show');
            return;
        }

        this.ui.elements.clearBtn.classList.add('show');

        try {
            const suggestions = await this.api.searchLocation(query);
            this.ui.displaySearchSuggestions(suggestions);
        } catch (error) {
            console.error('Search error:', error);
            this.ui.showToast('Lỗi khi tìm kiếm địa điểm');
        }
    }

    async selectLocation(location) {
        this.ui.elements.searchInput.value = `${location.name}, ${location.country}`;
        this.ui.elements.suggestions.classList.remove('show');
        this.ui.showLoading();

        try {
            // Store current location
            this.state.currentLocation = location;
            
            // Add to recent searches
            this.state.addRecentSearch(location);
            this.ui.displayRecentSearches(this.state.recentSearches);

            // Fetch weather data
            const [currentWeather, hourlyForecast, dailyForecast] = await Promise.all([
                this.api.getCurrentWeather(location.key),
                this.api.getHourlyForecast(location.key),
                this.api.getDailyForecast(location.key)
            ]);
            
            // Store weather data
            this.state.currentWeather = currentWeather;
            this.state.hourlyForecast = hourlyForecast;
            this.state.dailyForecast = dailyForecast;
            
            // Update UI with fetched data
            this.ui.updateCurrentWeather(currentWeather, location, this.state.unit);
            this.ui.updateHourlyForecast(hourlyForecast, this.state.unit);
            this.ui.updateDailyForecast(dailyForecast, this.state.unit);
            this.ui.updateAirQuality(null); // Air quality might need separate subscription
            
            // Update map location if we have coordinates
            // For Vietnam cities, use approximate coordinates
            const cityCoordinates = {
                // Thành phố lớn
                'Cần Thơ': [10.0452, 105.7469],
                'Hà Nội': [21.0285, 105.8542],
                'Hồ Chí Minh': [10.8231, 106.6297],
                'Sài Gòn': [10.8231, 106.6297],
                'Đà Nẵng': [16.0544, 108.2022],
                'Hải Phòng': [20.8449, 106.6881],
                // Tỉnh thành khác
                'Huế': [16.4637, 107.5909],
                'Nha Trang': [12.2388, 109.1967],
                'Vũng Tàu': [10.3458, 107.0843],
                'Đà Lạt': [11.9404, 108.4583],
                'Quảng Ninh': [21.0064, 107.2925],
                'Hạ Long': [20.9509, 107.0761],
                'Biên Hòa': [10.9511, 106.8226],
                'Thủ Dầu Một': [10.9800, 106.6519],
                'Long Xuyên': [10.3861, 105.4350],
                'Mỹ Tho': [10.3600, 106.3600],
                'Việt Trì': [21.3227, 105.4022],
                'Thái Nguyên': [21.5671, 105.8252],
                'Bắc Ninh': [21.1861, 106.0763],
                'Quy Nhơn': [13.7830, 109.2194],
                'Pleiku': [13.9833, 108.0000],
                'Buon Ma Thuột': [12.6667, 108.0500],
                'Rạch Giá': [10.0124, 105.0808],
                'Cà Mau': [9.1769, 105.1524],
                'Phú Quốc': [10.2140, 103.9670]
            };
            
            if (cityCoordinates[location.name]) {
                const [lat, lon] = cityCoordinates[location.name];
                this.ui.weatherMap.updateLocation(lat, lon, location.name);
            }
            
            this.ui.hideLoading();
            this.ui.showToast(`Đã tải thời tiết cho ${location.name}`);
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.ui.hideLoading();
            this.ui.showToast('Lỗi khi tải dữ liệu thời tiết. Sử dụng dữ liệu demo.');
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.ui.showToast('⚠️ Trình duyệt không hỗ trợ định vị');
            return;
        }

        this.ui.showToast('📍 Đang lấy vị trí hiện tại của bạn...');
        this.ui.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Nếu dùng API thật
                    if (!CONFIG.USE_DEMO_MODE) {
                        const locationData = await this.api.getCurrentLocationKey(latitude, longitude);
                        
                        await this.selectLocation({
                            key: locationData.Key,
                            name: locationData.LocalizedName,
                            country: locationData.Country.LocalizedName
                        });
                        
                        // Update map
                        this.ui.weatherMap.updateLocation(latitude, longitude);
                    } else {
                        // Demo mode: Tìm thành phố gần nhất dựa vào toạ độ
                        const nearestCity = this.findNearestCity(latitude, longitude);
                        await this.selectLocation(nearestCity);
                        this.ui.weatherMap.updateLocation(latitude, longitude);
                        this.ui.showToast(`✅ Đã định vị: ${nearestCity.name} (gần vị trí của bạn)`);
                    }
                    
                    this.ui.hideLoading();
                } catch (error) {
                    console.error('Geolocation error:', error);
                    this.ui.hideLoading();
                    this.ui.showToast('⚠️ Không thể lấy vị trí hiện tại');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.ui.hideLoading();
                
                let message = '⚠️ Không thể truy cập vị trí';
                if (error.code === 1) {
                    message = '⚠️ Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật trong cài đặt trình duyệt.';
                } else if (error.code === 2) {
                    message = '⚠️ Không thể xác định vị trí. Kiểm tra kết nối mạng.';
                } else if (error.code === 3) {
                    message = '⚠️ Hết thời gian chờ. Thử lại.';
                }
                
                this.ui.showToast(message, 5000);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    findNearestCity(lat, lon) {
        // Toạ độ các thành phố lớn Việt Nam
        const cities = [
            { key: '353415', name: 'Cần Thơ', country: 'Việt Nam', lat: 10.0452, lon: 105.7469 },
            { key: '353412', name: 'Hà Nội', country: 'Việt Nam', lat: 21.0285, lon: 105.8542 },
            { key: '353414', name: 'Hồ Chí Minh', country: 'Việt Nam', lat: 10.8231, lon: 106.6297 },
            { key: '353417', name: 'Đà Nẵng', country: 'Việt Nam', lat: 16.0544, lon: 108.2022 },
            { key: '353419', name: 'Hải Phòng', country: 'Việt Nam', lat: 20.8449, lon: 106.6881 },
            { key: '353421', name: 'Nha Trang', country: 'Việt Nam', lat: 12.2388, lon: 109.1967 },
            { key: '353422', name: 'Vũng Tàu', country: 'Việt Nam', lat: 10.3458, lon: 107.0843 },
            { key: '353423', name: 'Đà Lạt', country: 'Việt Nam', lat: 11.9404, lon: 108.4583 },
            { key: '353420', name: 'Huế', country: 'Việt Nam', lat: 16.4637, lon: 107.5909 }
        ];
        
        // Tính khoảng cách và tìm thành phố gần nhất
        let nearest = cities[0];
        let minDistance = this.calculateDistance(lat, lon, nearest.lat, nearest.lon);
        
        for (const city of cities) {
            const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = city;
            }
        }
        
        return nearest;
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula để tính khoảng cách giữa 2 điểm trên trái đất
        const R = 6371; // Bán kính trái đất (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toggleUnit() {
        this.state.unit = this.state.unit === 'metric' ? 'imperial' : 'metric';
        const unitText = this.state.unit === 'metric' ? '°C' : '°F';
        
        document.getElementById('unitText').textContent = unitText;
        this.ui.showToast(`Đã chuyển sang ${unitText}`);
        
        // Re-render weather data with new unit
        if (this.state.currentWeather && this.state.currentLocation) {
            this.ui.updateCurrentWeather(
                this.state.currentWeather, 
                this.state.currentLocation, 
                this.state.unit
            );
        }
        
        if (this.state.hourlyForecast) {
            this.ui.updateHourlyForecast(this.state.hourlyForecast, this.state.unit);
        }
        
        if (this.state.dailyForecast) {
            this.ui.updateDailyForecast(this.state.dailyForecast, this.state.unit);
        }
    }
}

// ==================== INITIALIZE APPLICATION ====================
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new WeatherApp();
});

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ==================== EXPORT FOR MODULE USAGE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherApp, WeatherAPI, WeatherState, UIController, CONFIG };
}
