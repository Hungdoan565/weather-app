# SkycastVN 🌤️

## Tổng quan

SkycastVN là ứng dụng dự báo thời tiết hiện đại, thân thiện và dễ sử dụng, được thiết kế đặc biệt cho người Việt Nam. Ứng dụng cung cấp thông tin thời tiết chính xác và cập nhật liên tục cho các thành phố lớn ở Việt Nam và một số địa điểm quốc tế, kèm theo các tính năng tìm kiếm thông minh, định vị thủ công và bản đồ tương tác.

🌐 **Truy cập trực tiếp:** [skycast-vn.netlify.app](https://skycast-vn.netlify.app/)

---

## Tính năng nổi bật

- **Tìm kiếm thông minh với Autocomplete:**  
  Tìm kiếm thành phố theo tên, quốc gia hoặc vùng miền. Hỗ trợ tìm kiếm các tỉnh thành Việt Nam được ánh xạ đến các thành phố lớn gần nhất.

- **Danh sách thành phố đã xác thực:**  
  Bao gồm 10 thành phố phổ biến của Việt Nam và 6 thành phố quốc tế, đảm bảo kết quả ổn định và đáng tin cậy với dữ liệu API thực tế.

- **Định vị thủ công:**  
  Người dùng có thể chủ động kích hoạt định vị để xác định vị trí hiện tại trên bản đồ và nhận thông tin thời tiết của thành phố gần nhất mà không bị làm phiền bởi các quyền tự động.

- **Bản đồ tương tác:**  
  Sậ dụng Leaflet.js với các tile của OpenStreetMap cho việc làm bản đồ tương tác. Có các marker tùy chỉnh đánh dấu các vị trí quan tâm mà không phụ thuộc vào nhiều API tile thời tiết khác nhau.

- **Giao diện sạch đẹp và responsive:**  
  Giao diện hiện đại với gợi ý tìm kiếm, thông báo toast, xử lý lỗi và trạng thái loading mượt mà. Hoàn toàn responsive và hỗ trợ chế độ sáng/tối linh hoạt.

- **Chế độ Demo và API thật:**  
  - Chế độ demo sử dụng dữ liệu giả lập đã được xác thực cho việc test và demo.  
  - Chế độ API thật lấy dữ liệu thời tiết trực tiếp từ AccuWeather API cho việc sử dụng thực tế.

---

## Công nghệ sử dụng

- **Frontend:** JavaScript thuần, HTML5, CSS3  
- **Bản đồ:** Leaflet.js + OpenStreetMap (miễn phí và mã nguồn mở)  
- **Dữ liệu thời tiết:** AccuWeather API - nhà cung cấp dữ liệu thời tiết thực tế  
- **Công cụ build:** Không cần (dự án vanilla JS để đơn giản và dễ chuyển đổi)

---

## Cách sử dụng

1. **Tìm kiếm thành phố:**  
   Bắt đầu nhập tên thành phố hoặc tỉnh thành vào ô tìm kiếm để xem các gợi ý autocomplete ưu tiên cho các vị trí Việt Nam.

2. **Định vị thủ công:**  
   Nhấp vào nút vị trí để kích hoạt quyền định vị của trình duyệt. Ứng dụng sẽ hiển thị thành phố đã xác thực gần nhất với dữ liệu thời tiết của nó.

3. **Bản đồ tương tác:**  
   Bản đồ cập nhật dựa trên thành phố hoặc vị trí được chọn, hiển thị marker với thông tin popup. Lớp nền bản đồ sử dụng các tile OpenStreetMap cho việc render nhanh và miễn phí.

4. **Hiển thị thời tiết:**  
   Chi tiết thời tiết được hiển thị cho thành phố được chọn, bao gồm nhiệt độ, điều kiện và dự báo, sử dụng dữ liệu mock đã cache hoặc các cuộc gọi API trực tiếp tùy theo chế độ.

---

## Thành phố được hỗ trợ

### Việt Nam (10 thành phố)
- Hà Nội  
- TP. Hồ Chí Minh (Sài Gòn)  
- Cần Thơ  
- Đà Nẵng  
- Hải Phòng  
- Nha Trang  
- Vũng Tàu  
- Đà Lạt  
- Huế  
- Quy Nhon  

### Quốc tế (6 thành phố)
- Bangkok  
- Tokyo  
- Seoul  
- Singapore  
- New York  
- London  

---

## Tại sao chọn dự án này?

- **Giữ cho trải nghiệm người dùng đơn giản và đáng tin cậy** bằng cách chỉ sử dụng một API thời tiết duy nhất (AccuWeather).  
- **Tránh sự phức tạp và phụ thuộc** vào nhiều API cho các tile bản đồ và lớp phủ thời tiết.  
- **Quyền định vị thủ công** tôn trọng quyền riêng tư và quyền kiểm soát của người dùng.  
- **Cung cấp dữ liệu thực tế** khớp với API sản xuất để tránh nhầm lẫn giữa chế độ demo và trực tiếp.  
- **Công nghệ stack đơn giản** cho phép tùy chỉnh và bảo trì dễ dàng.

---

## Đóng góp & Giấy phép

SkycastVN là dự án mã nguồn mở dành cho mục đích giáo dục và cộng đồng. Chào đón các đóng góp qua GitHub. Được cấp phép dưới giấy phép MIT.

---

*Phát triển bởi Đoàn Vĩnh Hưng*  
GitHub: https://github.com/Hungdoan565  
Email: hungmobile457@gmail.com

---

## 🐛 Troubleshooting

### Bản đồ không hiển thị
- Kiểm tra console có lỗi Leaflet không
- Đảm bảo đã thêm OpenWeatherMap API key
- Xóa cache trình duyệt và reload
- Kiểm tra firewall/antivirus có chặn Leaflet CDN không

### API không hoạt động
- Kiểm tra API key đã đúng chưa
- Verify API key còn hạn sử dụng
- Check API quota (free tier có giới hạn 50 calls/day)
- Mở Network tab trong DevTools để xem response
- Thử dùng chế độ demo (USE_DEMO_MODE = true)

### Autocomplete không hoạt động
- Đảm bảo `USE_DEMO_MODE = false` khi dùng API thật
- Kiểm tra debounce delay (mặc định 500ms)
- Verify AccuWeather API key permissions
- Gõ ít nhất 2 ký tự để kích hoạt autocomplete

### Chuyển đổi °C/°F không hoạt động
- Kiểm tra console có lỗi không
- Đảm bảo đã load dữ liệu thời tiết trước
- Try hard refresh (Ctrl+F5)
- Kiểm tra state.currentWeather có data không

## 📊 API Usage & Limits

### AccuWeather Free Tier
- **50 API calls/day**
- Location autocomplete ✅
- Current conditions ✅
- 5-day forecast ✅
- 12-hour hourly forecast ✅

### OpenWeatherMap Free Tier
- **1000 API calls/day**
- Weather map tiles ✅
- Unlimited map views ✅

## 🔐 Security Notes

⚠️ **Important:** 
- **KHÔNG** commit API keys lên Git/GitHub
- Trong production, sử dụng environment variables
- Consider using backend proxy cho API calls để bảo mật key
- Add `.env` file vào `.gitignore`

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Opera   | 76+     | ✅ Full |
| IE      | ❌      | Not supported |

## 🚀 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Total Bundle Size**: ~10KB (gzipped, không kể CDN)
- **API Response**: Cached for 10 minutes
- **Debounce**: 500ms cho search

## 📈 Future Enhancements

Các tính năng có thể thêm trong tương lai:
- [ ] Weather alerts & warnings
- [ ] Historical weather data
- [ ] Weather widgets for embedding
- [ ] PWA support (offline mode)
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Weather comparison (multiple cities)
- [ ] Export weather reports (PDF/CSV)
- [ ] Weather charts & graphs
- [ ] Social sharing

## 📄 License

MIT License - Free to use for personal and commercial projects

## 👨‍💻 Author

**Đoàn Vĩnh Hưng**
- GitHub: [@Hungdoan565](https://github.com/Hungdoan565)
- Email: hungmobile457@gmail.com
- Repository: [weather-app](https://github.com/Hungdoan565/weather-app)

Developed with ❤️ and ☕

## 🙏 Credits

- **AccuWeather API** - Weather data provider
- **OpenWeatherMap** - Weather map tiles & layers
- **Leaflet.js** - Interactive maps library
- **Font Awesome** - Beautiful icons
- **OpenStreetMap** - Base map tiles

## 📞 Support & Contact

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra phần **Troubleshooting** bên trên
2. Xem **console log** trong DevTools để debug
3. Mở issue trên GitHub repository
4. Check AccuWeather API documentation

## 🌟 Show Your Support

Nếu thấy project hữu ích:
- ⭐ Star repository này
- 🔀 Fork và custom theo ý bạn
- 📢 Share với bạn bè & đồng nghiệp
- 🐛 Report bugs hoặc contribute

---

**Made with ☕ and 💻 - Happy Coding! 🚀**
