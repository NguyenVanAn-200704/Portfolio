# Portfolio - Nguyễn Văn An

Trang portfolio tĩnh (HTML/CSS/JS thuần), song ngữ VI/EN.

- `index.html` – nội dung (tiếng Việt)
- `i18n.js` – bản dịch tiếng Anh
- `styles.css` – giao diện (đổi màu tại `:root`)
- `script.js` – hiệu ứng, chuyển ngôn ngữ, form liên hệ
- `assets/avatar.jpg` – ảnh chân dung (tùy chọn; nếu thiếu sẽ hiện monogram "AN")

Chạy thử: `python -m http.server 5500` rồi mở http://localhost:5500

Deploy: workflow `.github/workflows/deploy.yml` tự deploy lên GitHub Pages mỗi khi push vào `main`.
Lần đầu cần vào **Settings → Pages → Source** và chọn **GitHub Actions**.
Trang sẽ có tại https://nguyenvanan-200704.github.io/Portfolio/
