# Tiên Lộ Thần - Game Tu Luyện

Một web game tu luyện với giao diện đẹp mắt được xây dựng bằng Nuxt 3, Vue 3, Prisma và PostgreSQL.

## Tính năng

- **Hệ thống đăng nhập/đăng ký** với JWT authentication
- **Quản lý người chơi** với thông tin cấp độ, cảnh giới
- **Hệ thống tài nguyên** (Tiên Ngọc, Linh Thạch, Nguyên Thạch)
- **Bạn đồng hành** với các loại hiếm khác nhau
- **Thành tựu** và hệ thống phần thưởng
- **Nhiệm vụ** với các yêu cầu và phần thưởng
- **Giao diện tối** với theme fantasy/cultivation
- **Responsive design** với Tailwind CSS

## Công nghệ sử dụng

- **Nuxt 3** - Framework Vue.js
- **Vue 3** - Frontend framework
- **Tailwind CSS** - CSS framework
- **Pinia** - State management
- **Prisma** - ORM cho database
- **PostgreSQL** - Database (Neon)
- **Node.js** - Backend runtime
- **JWT** - Authentication

## Cài đặt

1. **Clone repository và cài đặt dependencies:**
```bash
git clone <repository-url>
cd tien-lo-than-game
npm install
```

2. **Cấu hình database:**
```bash
# Tạo file .env với DATABASE_URL
cp env.example .env

# Tạo database và tables
npx prisma db push

# Seed dữ liệu mẫu
npm run db:seed
```

3. **Chạy development server:**
```bash
npm run dev
```

4. **Mở trình duyệt và truy cập `http://localhost:3000`**

## Cấu trúc Database

### Bảng chính:
- **users** - Thông tin người dùng
- **players** - Thông tin người chơi
- **resources** - Các loại tài nguyên
- **player_resources** - Tài nguyên của người chơi
- **companions** - Bạn đồng hành
- **player_companions** - Bạn đồng hành của người chơi
- **achievements** - Thành tựu
- **player_achievements** - Thành tựu của người chơi
- **quests** - Nhiệm vụ
- **player_quests** - Nhiệm vụ của người chơi
- **game_configs** - Cấu hình game

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### Player
- `GET /api/player/resources?playerId={id}` - Lấy tài nguyên
- `GET /api/player/companions?playerId={id}` - Lấy bạn đồng hành
- `POST /api/player/update` - Cập nhật thông tin người chơi
- `POST /api/player/resources/update` - Cập nhật tài nguyên

### Utility
- `POST /api/seed` - Seed dữ liệu mẫu

## Cấu trúc dự án

```
├── assets/
│   └── css/
│       └── main.css          # Custom CSS styles
├── components/
│   └── LoginForm.vue         # Form đăng nhập/đăng ký
├── pages/
│   └── index.vue             # Trang chủ game
├── server/
│   └── api/                  # API endpoints
├── stores/
│   ├── auth.ts              # Auth store
│   └── player.ts            # Player store
├── prisma/
│   └── schema.prisma        # Database schema
├── scripts/
│   ├── seed.js              # Seed script
│   ├── migrate-to-postgresql.js  # Migration script
│   ├── verify-postgresql-migration.js  # Verification script
│   └── cleanup-sqlite.js    # Cleanup script
├── app.vue                  # Root component
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies
```

## Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed dữ liệu mẫu
- `npm run db:reset` - Reset và seed lại database

## Migration từ SQLite sang PostgreSQL

Dự án đã được migrate từ SQLite sang PostgreSQL (Neon) để có hiệu suất tốt hơn và khả năng mở rộng.

### Migration Scripts:
- `scripts/migrate-to-postgresql.js` - Script migrate data chính
- `scripts/verify-postgresql-migration.js` - Script verification
- `scripts/cleanup-sqlite.js` - Script cleanup SQLite cũ
- `POSTGRESQL_MIGRATION_SUMMARY.md` - Tài liệu migration chi tiết

### Chạy Migration:
```bash
# Migrate data từ SQLite sang PostgreSQL
node scripts/migrate-to-postgresql.js

# Verify migration
node scripts/verify-postgresql-migration.js

# Cleanup SQLite cũ (tùy chọn)
node scripts/cleanup-sqlite.js
```

## Phát triển

### Thêm tính năng mới:

1. **Thêm bảng mới** trong `prisma/schema.prisma`
2. **Tạo API endpoint** trong `server/api/`
3. **Cập nhật store** trong `stores/`
4. **Tạo component** trong `components/`
5. **Chạy migration** với `npm run db:push`

### Quản lý dữ liệu:

- Sử dụng **Prisma Client** để truy cập database
- Sử dụng **Pinia stores** để quản lý state
- Sử dụng **API routes** để xử lý business logic

## License

MIT