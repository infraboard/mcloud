# 使用官方的 Node 镜像作为基础镜像
FROM node:20-alpine AS build

# 在容器中创建一个工作目录
WORKDIR /app

# 将本地的源代码复制到工作目录
COPY . .

# 安装项目依赖
RUN npm install 

# 构建应用
RUN npm run  build

# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:latest

# 将构建好的 React 应用复制到 Nginx 的默认静态文件目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露容器的 80 端口
EXPOSE 80

# Nginx 配置文件，用于处理路由
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]