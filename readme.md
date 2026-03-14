# KOB —— 多人竞技贪吃蛇平台

## 项目简介

KOB（King of Bots）是一个**在线多人 AI 对战贪吃蛇游戏平台**。用户可以注册账号、编写自己的 AI Bot（支持 Python 等语言），并通过匹配系统与其他玩家的 Bot 进行 1v1 对战。系统会根据对战结果动态更新玩家积分（ELO 评分机制），并提供排行榜和对局回放功能。

---

## 核心功能

| 功能模块 | 说明 |
|---|---|
| 用户注册 / 登录 | 账号密码登录 + AcWing OAuth 第三方登录 |
| Bot 管理 | 创建、修改、删除 AI Bot，编写 Bot 逻辑代码 |
| 实时 PK 对战 | 基于 WebSocket 的实时双人贪吃蛇对战 |
| 自动匹配 | 独立匹配服务，按积分自动为玩家配对 |
| Bot 沙箱执行 | 独立服务动态编译并执行用户 Bot 代码 |
| 对局记录 | 保存所有对局的地图、步骤、胜负结果 |
| 排行榜 | 展示玩家积分排名 |
| 录像回放 | 根据对局记录重播完整游戏过程 |

---

## 技术栈

### 后端（Java 微服务）

| 技术 | 版本 | 用途 |
|---|---|---|
| Spring Boot | 2.6.13 | 核心 Web 框架 |
| Spring Security | 随 Spring Boot | 鉴权与权限控制 |
| JWT | — | 无状态 Token 认证 |
| MyBatis Plus | — | ORM 框架，简化数据库操作 |
| WebSocket | — | 实时双向通信（游戏画面同步） |
| MySQL | 8.x | 关系型数据库 |
| RestTemplate / HttpClient | — | 微服务间 HTTP 调用 |
| JOOR（反射编译） | — | 运行时动态编译用户 Bot 代码 |
| FastJSON2 | — | JSON 序列化 / 反序列化 |
| Maven | 3.x | 项目构建与依赖管理 |

### 前端（Web 端）

| 技术 | 版本 | 用途 |
|---|---|---|
| Vue 3 | 3.2.13 | 前端核心框架 |
| Vue Router | 4.0.3 | 客户端路由 |
| Vuex | 4.0.0 | 全局状态管理 |
| Bootstrap | 5.3.3 | UI 样式框架 |
| jQuery | 3.7.1 | AJAX 请求 |
| vue3-ace-editor | 2.2.4 | 代码编辑器（编写 Bot 代码） |
| Vue CLI | 5.x | 项目脚手架与构建工具 |

---

## 项目架构

```
kob/
├── backendcloud/              # 后端微服务（Java）
│   ├── backend/               # 主服务（端口 3000）：用户、Bot、对局、排名、WebSocket
│   ├── matchingsystem/        # 匹配服务（端口 3001）：玩家匹配队列
│   ├── botrunningsystem/      # Bot 执行服务（端口 3002）：动态编译运行 Bot 代码
│   └── pom.xml                # Maven 父工程
├── web/                       # Web 前端（Vue 3）
└── acapp/                     # 移动端（Vue 3 + AcWing App）
```

### 微服务职责

```
浏览器
  │
  ├─── HTTP/WebSocket ──▶ backend (3000)
  │                           │
  │                           ├─── HTTP ──▶ matchingsystem (3001)
  │                           │            （玩家进入/离开匹配队列）
  │                           │
  │                           └─── HTTP ──▶ botrunningsystem (3002)
  │                                         （请求 Bot 执行，返回下一步操作）
  └─── MySQL ─────────────────────────────▶ kob 数据库
```

---

## 数据库设计

### user 表（用户）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT PK | 自增主键 |
| username | VARCHAR | 用户名 |
| password | VARCHAR | 密码（加密存储） |
| photo | VARCHAR | 头像 URL |
| rating | INT | ELO 积分（默认 1500） |
| openid | VARCHAR | AcWing OAuth 唯一标识 |

### bot 表（AI Bot）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT PK | 自增主键 |
| user_id | INT FK | 归属用户 |
| title | VARCHAR | Bot 名称 |
| description | TEXT | Bot 描述 |
| content | TEXT | Bot 代码（Python 等） |
| create_time | DATETIME | 创建时间 |
| modify_time | DATETIME | 最后修改时间 |

### record 表（对局记录）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT PK | 自增主键 |
| a_id / b_id | INT FK | 双方玩家 ID |
| a_sx / a_sy | INT | A 方蛇的起始坐标 |
| b_sx / b_sy | INT | B 方蛇的起始坐标 |
| a_steps / b_steps | TEXT | 双方每回合的操作序列 |
| map | TEXT | 地图数据（随机障碍物编码） |
| loser | VARCHAR | 败者标识（`A` / `B` / `all`） |
| create_time | DATETIME | 对局时间 |

---

## API 接口概览

### 用户接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/user/account/token/` | 登录，返回 JWT Token |
| POST | `/api/user/account/register/` | 注册新账号 |
| GET | `/api/user/account/info/` | 获取当前用户信息（需 JWT） |
| GET | `/api/user/account/acwing/web/apply_code/` | 申请 AcWing OAuth 授权码 |
| GET | `/api/user/account/acwing/web/receive_code/` | AcWing OAuth 回调 |

### Bot 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/user/bot/add/` | 新建 Bot |
| GET | `/api/user/bot/getlist/` | 获取当前用户 Bot 列表 |
| POST | `/api/user/bot/update/` | 修改 Bot |
| POST | `/api/user/bot/remove/` | 删除 Bot |

### 对局 / 排行

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/pk/start/game/` | 开始对局（匹配完成后调用） |
| POST | `/pk/receive/bot/move/` | 接收 Bot 返回的移动方向 |
| GET | `/api/ranklist/getlist/` | 获取排行榜（分页） |
| GET | `/api/record/getlist/` | 获取对局记录（分页） |

### WebSocket 事件

- **连接**：`wss://<host>/websocket/{token}/`
- `start-matching` ——  发起 / 取消匹配
- `move` —— 玩家手动操作（键盘方向键）
- `game-over` —— 游戏结束通知

---

## 前端路由

| 路径 | 页面 | 需登录 |
|---|---|---|
| `/pk/` | 匹配对战页 | ✅ |
| `/record/` | 对局记录列表 | ✅ |
| `/record/:recordId/` | 对局回放详情 | ✅ |
| `/ranklist/` | 排行榜 | ✅ |
| `/user/bot/` | Bot 管理 | ✅ |
| `/user/account/login/` | 登录页 | ❌ |
| `/user/account/register/` | 注册页 | ❌ |

---

## 游戏逻辑

游戏运行在 `<canvas>` 画布上，核心脚本位于 `web/src/assets/scripts/`：

| 文件 | 说明 |
|---|---|
| `AcGameObject.js` | 所有游戏对象的基类，统一管理帧循环（requestAnimationFrame） |
| `GameMap.js` | 游戏地图：渲染格子、随机生成障碍墙、碰撞检测 |
| `Snake.js` | 蛇实体：存储身体坐标、处理移动、判断死亡 |
| `Wall.js` | 障碍物渲染 |
| `Cell.js` | 单个格子的坐标封装 |

地图生成使用**随机化 + 连通性 BFS 验证**确保双方起点互通。蛇的移动方向由玩家键盘输入或 Bot 返回结果决定，每回合服务端校验并广播最新状态。

---

## 快速启动

### 环境依赖

- JDK 8+
- Maven 3.6+
- Node.js 16+ / pnpm
- MySQL 8.x

### 数据库初始化

```sql
CREATE DATABASE kob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kob;

CREATE TABLE `user` (
  `id`       INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `photo`    VARCHAR(255) DEFAULT NULL,
  `rating`   INT DEFAULT 1500,
  `openid`   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `bot` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `user_id`     INT NOT NULL,
  `title`       VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `content`     MEDIUMTEXT,
  `create_time` DATETIME DEFAULT NULL,
  `modify_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `record` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `a_id`       INT NOT NULL,
  `a_sx`       INT DEFAULT NULL,
  `a_sy`       INT DEFAULT NULL,
  `b_id`       INT NOT NULL,
  `b_sx`       INT DEFAULT NULL,
  `b_sy`       INT DEFAULT NULL,
  `a_steps`    TEXT,
  `b_steps`    TEXT,
  `map`        TEXT,
  `loser`      VARCHAR(10) DEFAULT NULL,
  `create_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 启动后端（三个微服务）

```bash
cd backendcloud
mvn clean package -DskipTests

# 窗口 1：主服务
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar

# 窗口 2：匹配服务
java -jar matchingsystem/target/matchingsystem-0.0.1-SNAPSHOT.jar

# 窗口 3：Bot 执行服务
java -jar botrunningsystem/target/botrunningsystem-0.0.1-SNAPSHOT.jar
```

### 启动前端

> 前端使用 **pnpm** 作为包管理工具；若未安装，可执行 `npm install -g pnpm` 或使用 `npm` 替代。

```bash
cd web
pnpm install
pnpm run serve   # 默认访问 http://localhost:8080
```

---

## 目录结构

```
backendcloud/backend/src/main/java/com/kob/backend/
├── config/          # Spring Security、WebSocket、MVC 配置
├── consumer/        # WebSocket 消费者（游戏主循环）
├── controller/      # REST 控制器
├── mapper/          # MyBatis Plus Mapper 接口
├── pojo/            # 实体类（User、Bot、Record）
├── service/         # 业务接口
│   └── impl/        # 业务实现
└── utils/           # JWT 工具、自定义 Bot API 接口

web/src/
├── assets/scripts/  # 游戏引擎（Canvas 渲染）
├── components/      # 可复用 Vue 组件（NavBar、GameMap、MatchGround 等）
├── router/          # 路由配置
├── store/           # Vuex Store（user、pk、record 模块）
└── views/           # 页面级组件
```
