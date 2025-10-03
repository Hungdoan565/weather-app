# 🔑 Hướng dẫn Lấy API Key

## 📋 Mục lục
1. [AccuWeather API](#accuweather-api) - Dữ liệu thời tiết
2. [OpenWeatherMap API](#openweathermap-api) - Bản đồ thời tiết
3. [Cấu hình API trong code](#cấu-hình-api)

---

## AccuWeather API

### Bước 1: Đăng ký tài khoản
1. Truy cập: https://developer.accuweather.com/user/register
2. Điền thông tin:
   - Email
   - Password
   - First Name / Last Name
3. Click **"Register"**
4. Xác nhận email (check hộp thư)

### Bước 2: Tạo App để lấy API Key
1. Đăng nhập vào: https://developer.accuweather.com/
2. Click **"My Apps"** trên menu
3. Click **"+ Add a new App"**
4. Điền thông tin:
   - **App Name**: `Weather App` (hoặc tên bất kỳ)
   - **Description**: `Personal weather application`
5. Click **"Create App"**

### Bước 3: Copy API Key
1. Sau khi tạo App, bạn sẽ thấy **API Key**
2. Copy API Key này (dạng: `aBc123XyZ456...`)
3. Lưu lại để dùng sau

### Giới hạn Free Tier
- ✅ **50 API calls mỗi ngày** (reset vào 0h UTC)
- ✅ Location search (autocomplete)
- ✅ Current conditions (thời tiết hiện tại)
- ✅ 5-day forecast (dự báo 5 ngày)
- ✅ 12-hour hourly forecast

> **Lưu ý:** 50 calls/ngày là đủ cho sử dụng cá nhân. Mỗi lần search + load thời tiết tiêu tốn khoảng 3-4 calls.

---

## OpenWeatherMap API

### Bước 1: Đăng ký
1. Truy cập: https://home.openweathermap.org/users/sign_up
2. Điền thông tin và đăng ký
3. Xác nhận email

### Bước 2: Lấy API Key
1. Đăng nhập: https://home.openweathermap.org/
2. Click vào tab **"API keys"**
3. Bạn sẽ thấy một **Default API key** đã được tạo sẵn
4. Copy API key này

### Bước 3: Chờ kích hoạt
- ⏰ API key cần **10-15 phút** để kích hoạt
- Đợi một chút trước khi sử dụng
- Test bằng cách reload trang sau 15 phút

### Giới hạn Free Tier
- ✅ **1000 API calls/ngày**
- ✅ Weather map tiles (unlimited views)
- ✅ Temperature, precipitation, wind, clouds layers

> **Lưu ý:** OpenWeatherMap chỉ dùng cho bản đồ. Bạn có thể bỏ qua nếu không cần bản đồ.

---

## Cấu hình API

### Trong file `app.js`

#### 1. Thêm AccuWeather API Key
Tìm **dòng 16** trong `app.js`:

```javascript
const CONFIG = {
    API_KEY: 'YOUR_ACCUWEATHER_API_KEY', // ← THAY ĐỔI Ở ĐÂY
    // ...
    USE_DEMO_MODE: true // ← Đổi thành false
};
```

**Sau khi thay:**
```javascript
const CONFIG = {
    API_KEY: 'aBc123XyZ456DefGhi789...', // ← API key của bạn
    // ...
    USE_DEMO_MODE: false // ← Tắt demo mode
};
```

#### 2. Thêm OpenWeatherMap API Key (cho bản đồ)
Tìm **dòng 330** trong `app.js`:

```javascript
const OWM_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // ← THAY ĐỔI Ở ĐÂY
```

**Sau khi thay:**
```javascript
const OWM_API_KEY = 'xyz789AbC123...'; // ← API key của bạn
```

### Lưu file và reload trang

Sau khi thay API keys:
1. **Save** file `app.js` (Ctrl + S)
2. **Reload** trang web (F5 hoặc Ctrl + R)
3. Thời tiết sẽ load **dữ liệu thật** từ AccuWeather

---

## ✅ Kiểm tra API đã hoạt động

### Cách 1: Xem Console
1. Mở **Developer Tools** (F12)
2. Vào tab **Console**
3. Nếu thành công, bạn sẽ thấy:
   ```
   Weather data loaded successfully
   ```
4. Nếu lỗi, bạn sẽ thấy:
   ```
   API Error: 401 (Invalid API key)
   hoặc
   API Error: 503 (API limit exceeded)
   ```

### Cách 2: Xem Network
1. Mở **Developer Tools** (F12)
2. Vào tab **Network**
3. Reload trang
4. Tìm requests tới `dataservice.accuweather.com`
5. Click vào request và xem **Response**
6. Nếu thành công, bạn sẽ thấy dữ liệu JSON

### Cách 3: Xem Toast notification
- Nếu API hoạt động: "Đã tải thời tiết cho [Tên thành phố]"
- Nếu demo mode: "Đang sử dụng dữ liệu demo..."

---

## ⚠️ Các lỗi thường gặp

### Lỗi 1: Invalid API Key (401)
**Nguyên nhân:**
- API key sai
- Copy thiếu hoặc thừa ký tự
- Có dấu cách trước/sau API key

**Giải pháp:**
- Copy lại API key cẩn thận
- Xóa hết dấu cách
- Đảm bảo không có dấu ngoặc kép thừa

### Lỗi 2: API Limit Exceeded (503)
**Nguyên nhân:**
- Đã dùng hết 50 calls/ngày
- Reset vào 0h UTC (7h sáng giờ Việt Nam)

**Giải pháp:**
- Chờ đến ngày mai
- Hoặc dùng demo mode tạm thời
- Nâng cấp lên paid plan

### Lỗi 3: CORS Error
**Nguyên nhân:**
- Mở file HTML trực tiếp (file://)
- Không dùng HTTP server

**Giải pháp:**
- Dùng Live Server trong VS Code
- Hoặc Python HTTP server:
  ```bash
  python -m http.server 8000
  ```

### Lỗi 4: Bản đồ không hiển thị
**Nguyên nhân:**
- Chưa thêm OpenWeatherMap API key
- API key chưa kích hoạt (cần đợi 15 phút)

**Giải pháp:**
- Đợi 15 phút sau khi đăng ký OWM
- Kiểm tra lại API key
- Clear cache và reload

---

## 📊 Giám sát API Usage

### AccuWeather
1. Đăng nhập: https://developer.accuweather.com/
2. Click **"My Apps"**
3. Xem **API calls** đã dùng hôm nay
4. Theo dõi để không vượt quá 50 calls

### OpenWeatherMap
1. Đăng nhập: https://home.openweathermap.org/
2. Click **"Statistics"**
3. Xem biểu đồ API calls
4. Free tier có 1000 calls/ngày

---

## 💡 Tips tiết kiệm API calls

1. **Dùng demo mode khi phát triển**
   - Set `USE_DEMO_MODE = true` khi code
   - Chỉ set `false` khi test cuối cùng

2. **Tận dụng caching**
   - App đã cache 10 phút
   - Không cần reload liên tục

3. **Hạn chế search**
   - Mỗi lần search = 1 call
   - Mỗi lần load weather = 3 calls
   - Dùng recent searches thay vì search lại

4. **Local development**
   - Dùng demo data khi code UI
   - Chỉ test API khi cần

---

## 🔒 Bảo mật API Key

### ⚠️ QUAN TRỌNG:

1. **KHÔNG commit API key lên Git/GitHub**
   - File `.gitignore` đã được tạo
   - Nhưng vẫn cẩn thận khi commit

2. **Nếu vô tình push API key lên GitHub:**
   - Vào AccuWeather > My Apps
   - **Regenerate API key** ngay lập tức
   - Update key mới trong code

3. **Cho dự án thực tế:**
   - Dùng environment variables
   - Không hardcode API key trong code
   - Sử dụng backend proxy

---

## 📞 Hỗ trợ

Nếu gặp vấn đề với API:

1. **Check documentation:**
   - AccuWeather: https://developer.accuweather.com/apis
   - OpenWeatherMap: https://openweathermap.org/api

2. **Debug:**
   - Mở Console (F12)
   - Check Network tab
   - Xem error messages

3. **Contact:**
   - GitHub Issues: [weather-app](https://github.com/Hungdoan565/weather-app/issues)
   - Email: hungmobile457@gmail.com

---

**Chúc bạn thành công! 🎉**

*Developed by Đoàn Vĩnh Hưng*
