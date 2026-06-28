**Một ứng dụng mạng xã hội full-stack được xây dựng từ đầu, mô phỏng các tính năng cốt lõi của Facebook.**  
Dự án này cho phép người dùng đăng bài viết kèm ảnh/video, tương tác qua like/comment/share, đăng story, kết bạn, và quản lý hồ sơ cá nhân — tất cả được xây dựng với kiến trúc hiện đại, responsive và hỗ trợ dark mode.

### 🎯 Động lực

Dự án này được xây dựng với mục tiêu:
- **Học tập & Thực hành:** Áp dụng kiến thức full-stack (Next.js, Express, MongoDB) vào một dự án thực tế, quy mô lớn
- **Minh chứng năng lực:** Xây dựng một sản phẩm hoàn chỉnh từ frontend đến backend, từ thiết kế đến triển khai
- **Khác biệt:** So với các clone thông thường, dự án chú trọng vào UI/UX chuyên nghiệp (shadcn/ui, dark mode, animation mượt mà), validation chặt chẽ, và kiến trúc code sạch, dễ bảo trì
- **Cộng đồng:** Tạo ra một mã nguồn mở để mọi người có thể học hỏi, đóng góp và phát triển thêm

---

## 📌 Mục lục

- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và Khởi chạy](#-cài-đặt-và-khởi-chạy)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [API Endpoints](#-api-endpoints)
- [Chạy Kiểm thử](#-chạy-kiểm-thử)
- [Thông tin liên hệ](#-thông-tin-liên-hệ)

---

## ✨ Tính năng nổi bật

- 🔐 **Xác thực người dùng** — Đăng ký, đăng nhập, đăng xuất với JWT (httpOnly cookie), validation chặt chẽ (tuổi ≥ 18, mật khẩu ≥ 8 ký tự)
- 📝 **Bài viết (Posts)** — Tạo bài viết kèm nội dung văn bản + ảnh/video, xóa bài viết, hiển thị feed theo thời gian thực
- ❤️ **Tương tác** — Like/Unlike bài viết, bình luận kèm ảnh/video, chia sẻ bài viết lên mạng xã hội (Facebook, Twitter, LinkedIn)
- 📸 **Stories** — Đăng story dạng ảnh/video, xem story với giao diện preview, tự động xóa sau 24h
- 👥 **Kết bạn** — Follow/Unfollow người dùng, gợi ý kết bạn, danh sách lời mời, bạn chung (mutual friends)
- 👤 **Hồ sơ cá nhân** — Trang profile với ảnh đại diện, ảnh bìa, tiểu sử (bio), thông tin cá nhân, danh sách bài viết
- 🎬 **Video Feed** — Trang xem video riêng, lọc bài viết dạng video từ feed chính
- 🔍 **Tìm kiếm người dùng** — Thanh tìm kiếm real-time, gợi ý người dùng khi gõ
- 🌓 **Dark Mode** — Hỗ trợ chế độ sáng/tối với next-themes, lưu preference
- 📱 **Responsive Design** — Giao diện tối ưu trên mọi thiết bị (mobile, tablet, desktop)
- ⚡ **Hiệu ứng mượt mà** — Animation với Framer Motion, skeleton loading, optimistic updates
- 📄 **API Documentation** — Swagger UI tích hợp sẵn tại `/api-docs`

---

## 🛠 Công nghệ sử dụng

### Frontend

| Thành phần | Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.2.9 |
| **UI Library** | React | 19.2.4 |
| **Styling** | Tailwind CSS | 4.3.1 |
| **UI Components** | shadcn/ui (Radix UI) | 4.12.0 |
| **State Management** | Zustand | 5.0.14 |
| **Form Validation** | React Hook Form + Yup | 7.80.0 / 1.7.1 |
| **Animation** | Framer Motion | 12.42.0 |
| **HTTP Client** | Axios | 1.18.1 |
| **Icons** | Lucide React, Tabler Icons | 1.21.0 / 3.44.0 |
| **Emoji Picker** | emoji-picker-react | 4.19.1 |
| **Dark Mode** | next-themes | 0.4.6 |
| **Notifications** | react-hot-toast | 2.6.0 |
| **Linting/Formatting** | Biome, ESLint | 2.4.16 / 10.x |

### Backend

| Thành phần | Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| **Runtime** | Node.js | — |
| **Framework** | Express | 5.2.1 |
| **Database** | MongoDB + Mongoose | 9.7.3 |
| **Authentication** | JSON Web Token (JWT) + bcryptjs | 9.0.3 / 3.0.3 |
| **File Upload** | Multer + Cloudinary | 2.2.0 / 1.41.3 |
| **API Documentation** | Swagger (swagger-jsdoc + swagger-ui-express) | 6.3.0 / 5.0.1 |
| **Dev Server** | Nodemon | 3.1.14 |
| **Linting/Formatting** | Biome, ESLint | 2.4.16 / 10.x |

---

## 📁 Cấu trúc dự án

```
1-facebook-clone/
├── AGENTS.md
├── README.md
│
├── backend/                          # 🖥️ Backend (Express + MongoDB)
│   ├── src/
│   │   ├── index.js                  # Entry point, khởi tạo server
│   │   ├── config/
│   │   │   ├── db.js                 # Kết nối MongoDB
│   │   │   ├── cloudinary.js         # Cấu hình Cloudinary upload
│   │   │   └── swagger.js            # Cấu hình Swagger API docs
│   │   ├── models/
│   │   │   ├── User.js               # Model người dùng
│   │   │   ├── Post.js               # Model bài viết
│   │   │   ├── Story.js              # Model story
│   │   │   └── Bio.js                # Model tiểu sử
│   │   ├── controllers/
│   │   │   ├── authController.js     # Xử lý đăng ký, đăng nhập, đăng xuất
│   │   │   ├── postController.js     # CRUD bài viết, like, comment, share
│   │   │   ├── storyController.js    # CRUD story
│   │   │   └── userController.js     # Follow, profile, bio, friend requests
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/v1/auth
│   │   │   ├── postRoutes.js         # /api/v1/posts
│   │   │   ├── storyRoutes.js        # /api/v1/stories
│   │   │   └── userRoutes.js         # /api/v1/users
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Xác thực JWT
│   │   │   └── multerMiddleware.js   # Upload file (ảnh/video)
│   │   └── utils/
│   │       ├── generateToken.js      # Tạo JWT token
│   │       └── responseHandler.js    # Format response chuẩn
│   ├── .env.example                  # Biến môi trường mẫu
│   ├── package.json
│   └── biome.json
│
└── frontend/                         # 🎨 Frontend (Next.js + Tailwind)
    ├── src/
    │   ├── app/                      # App Router pages
    │   │   ├── layout.jsx            # Root layout (ThemeProvider, AuthWrapper)
    │   │   ├── page.jsx              # Trang chủ (HomePage)
    │   │   ├── globals.css           # Global styles + Tailwind + shadcn
    │   │   ├── user-login/           # Đăng nhập / Đăng ký
    │   │   ├── user-profile/         # Profile cá nhân
    │   │   ├── user-profile/[id]/    # Profile người dùng khác
    │   │   ├── profile/              # Profile (alias)
    │   │   ├── friends-list/         # Quản lý bạn bè
    │   │   └── video-feed/           # Trang xem video
    │   ├── components/
    │   │   ├── Header.jsx            # Thanh điều hướng chính
    │   │   ├── LeftSidebar.jsx       # Sidebar trái (menu + user info)
    │   │   ├── RightSidebar.jsx      # Sidebar phải (sponsors)
    │   │   ├── AuthWrapper.jsx       # Kiểm tra xác thực toàn cục
    │   │   ├── HomePage.jsx          # Trang chủ (story + post feed)
    │   │   ├── NewPostForm.jsx       # Form tạo bài viết (modal)
    │   │   ├── PostCard.jsx          # Card bài viết (like, comment, share)
    │   │   ├── PostComments.jsx      # Phần bình luận
    │   │   ├── StorySection.jsx      # Thanh story ngang
    │   │   ├── StoryCard.jsx         # Card story
    │   │   ├── StoryPreview.jsx      # Preview story (modal)
    │   │   ├── login-form.jsx        # Form đăng nhập
    │   │   ├── signup-form.jsx       # Form đăng ký
    │   │   ├── FriendsPage.jsx       # Trang bạn bè
    │   │   ├── VideoPage.jsx         # Trang video
    │   │   ├── ProfilePage.jsx       # Trang profile
    │   │   ├── Loader.jsx            # Loading spinner
    │   │   ├── friends/              # Components bạn bè
    │   │   │   ├── FriendCardSkeleton.jsx
    │   │   │   ├── FriendRequest.jsx
    │   │   │   └── FriendSuggestion.jsx
    │   │   ├── profile/              # Components profile
    │   │   │   ├── ProfileHeader.jsx
    │   │   │   ├── ProfileTabs.jsx
    │   │   │   ├── IntroCard.jsx
    │   │   │   ├── EditBio.jsx
    │   │   │   ├── PostContent.jsx
    │   │   │   ├── PhotosContent.jsx
    │   │   │   └── MutualFriends.jsx
    │   │   ├── video/
    │   │   │   ├── VideoCard.jsx
    │   │   │   └── VideoComments.jsx
    │   │   └── ui/                   # shadcn/ui components
    │   ├── services/                 # API service layer
    │   │   ├── urlService.js         # Axios instance (base URL)
    │   │   ├── authService.js        # Auth API calls
    │   │   ├── postService.js        # Post/Story API calls
    │   │   └── userService.js        # User API calls
    │   ├── store/                    # Zustand stores
    │   │   ├── userStore.js          # User state (persisted)
    │   │   ├── postStore.js          # Posts & stories state
    │   │   ├── sidebarStore.js       # Sidebar toggle state
    │   │   └── userFriendStore.js    # Friends state
    │   ├── validation/               # Yup validation schemas
    │   │   ├── loginSchema.js
    │   │   └── registerSchema.js
    │   ├── data/                     # Mock data (fallback)
    │   ├── lib/
    │   │   └── utils.js              # cn() utility
    │   └── utils/
    │       └── routes.js             # Route constants
    ├── public/                       # Static assets
    ├── .env.example
    ├── next.config.mjs
    ├── package.json
    └── biome.json
```

---

## ⚙️ Cài đặt và Khởi chạy

### Điều kiện tiên quyết

- **Node.js** ≥ 18.x
- **MongoDB** (local hoặc MongoDB Atlas)
- **Tài khoản Cloudinary** (để upload ảnh/video) — [Đăng ký miễn phí](https://cloudinary.com/users/register/free)

### 1. Clone repository

```bash
git clone https://github.com/anhtuan11cwt/1-facebook-clone.git
cd 1-facebook-clone
```

### 2. Cài đặt dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Cấu hình biến môi trường

**Backend** — Tạo file `backend/.env` từ file mẫu:

```bash
cp backend/.env.example backend/.env
```

Sau đó mở file `backend/.env` và điền các thông số:

```env
CLIENT_URL=http://localhost:3000
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/facebook-clone?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend** — Tạo file `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/v1
```

### 4. Khởi chạy dự án

**Chạy Backend (port 8080):**

```bash
cd backend
npm run dev
```

Server sẽ chạy tại `http://localhost:8080`  
Swagger UI tại `http://localhost:8080/api-docs`

**Chạy Frontend (port 3000):**

```bash
cd frontend
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

---

## 💡 Hướng dẫn sử dụng

### Tài khoản Demo

Bạn cần **tự tạo tài khoản mới** qua form đăng ký tại `/user-login`:

1. Truy cập `http://localhost:3000/user-login`
2. Chuyển sang tab **Đăng ký**
3. Điền thông tin: tên người dùng, email, mật khẩu (≥ 8 ký tự), ngày sinh (≥ 18 tuổi), giới tính
4. Sau khi đăng ký thành công, chuyển sang tab **Đăng nhập** để đăng nhập

### Luồng sử dụng chính

1. **Trang chủ** (`/`): Xem feed bài viết, story, tạo bài viết mới
2. **Tạo bài viết**: Click vào ô "Bạn đang nghĩ gì?" → Nhập nội dung → Thêm ảnh/video → Đăng
3. **Tương tác**: Like, bình luận (kèm emoji, ảnh/video), chia sẻ bài viết
4. **Story**: Click "Tạo tin" → Chọn ảnh/video → Đăng
5. **Kết bạn**: Vào trang "Bạn bè" → Xem lời mời / gợi ý → Kết bạn
6. **Profile**: Click avatar → "Hồ sơ" → Xem/Cập nhật thông tin, ảnh đại diện, ảnh bìa
7. **Video**: Vào trang "Video" để xem các bài viết dạng video
8. **Tìm kiếm**: Gõ tên người dùng trên thanh tìm kiếm
9. **Dark Mode**: Click avatar → Chuyển đổi chế độ sáng/tối

---

## 📡 API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Mô tả | Xác thực |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/login` | Đăng nhập | ❌ |
| `GET` | `/logout` | Đăng xuất | ❌ |

### Posts (`/api/v1/posts`)

| Method | Endpoint | Mô tả | Xác thực |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lấy tất cả bài viết (mới nhất trước) | ❌ |
| `GET` | `/user/:userId` | Lấy bài viết theo người dùng | ❌ |
| `POST` | `/` | Tạo bài viết mới (kèm ảnh/video) | ✅ |
| `DELETE` | `/:postId` | Xóa bài viết | ✅ |
| `POST` | `/:postId/likes` | Thích / Bỏ thích bài viết | ✅ |
| `POST` | `/:postId/comments` | Thêm bình luận (kèm ảnh/video) | ✅ |
| `DELETE` | `/:postId/comments/:commentId` | Xóa bình luận | ✅ |
| `POST` | `/:postId/share` | Chia sẻ bài viết | ✅ |

### Stories (`/api/v1/stories`)

| Method | Endpoint | Mô tả | Xác thực |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lấy tất cả story | ❌ |
| `POST` | `/` | Tạo story mới (bắt buộc ảnh/video) | ✅ |
| `DELETE` | `/:storyId` | Xóa story | ✅ |

### Users (`/api/v1/users`)

| Method | Endpoint | Mô tả | Xác thực |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lấy tất cả người dùng | ❌ |
| `GET` | `/check-auth` | Kiểm tra xác thực | ✅ |
| `GET` | `/profile/:userId` | Lấy thông tin hồ sơ | ✅ |
| `PUT` | `/profile` | Cập nhật hồ sơ (username, gender, DOB, avatar) | ✅ |
| `PUT` | `/cover-photo` | Cập nhật ảnh bìa | ✅ |
| `POST` | `/bio` | Tạo / Cập nhật tiểu sử | ✅ |
| `POST` | `/follow` | Follow người dùng | ✅ |
| `POST` | `/unfollow` | Hủy follow | ✅ |
| `GET` | `/friend-requests` | Lấy danh sách lời mời kết bạn | ✅ |
| `GET` | `/suggestions` | Gợi ý kết bạn | ✅ |
| `GET` | `/mutual-friends` | Bạn chung | ✅ |
| `POST` | `/delete-request` | Từ chối lời mời kết bạn | ✅ |

> 📖 **API Documentation đầy đủ**: Truy cập `http://localhost:8080/api-docs` khi server đang chạy để xem Swagger UI.

---

## 🧪 Chạy Kiểm thử

Hiện tại dự án chưa có bộ test tự động. Bạn có thể chạy lệnh test mặc định:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

> ⚠️ Dự án đang trong giai đoạn phát triển, test sẽ được bổ sung trong các phiên bản tiếp theo.

---

## 📞 Thông tin liên hệ

**Tác giả:** Trần Anh Tuấn

- **GitHub:** [@anhtuan11cwt](https://github.com/anhtuan11cwt)
- **Dự án:** [1-facebook-clone](https://github.com/anhtuan11cwt/1-facebook-clone)

### Lời cảm ơn

- [Next.js](https://nextjs.org/) — Framework React cho production
- [shadcn/ui](https://ui.shadcn.com/) — Bộ components UI đẹp mắt
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) — State management nhẹ nhàng
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Cloudinary](https://cloudinary.com/) — Media management & optimization
- [MongoDB](https://www.mongodb.com/) — NoSQL database linh hoạt
- [Biome](https://biomejs.dev/) — Toolchain cho linting & formatting
- Cảm ơn tất cả các bạn đã quan tâm và ủng hộ dự án! ❤️