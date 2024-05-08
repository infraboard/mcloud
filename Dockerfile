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

# 将构建好的 Vue 应用复制到 Nginx 的默认静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露容器的 80 端口
EXPOSE 80

# Nginx 配置文件，用于处理路由

# 配置反向代理默认地址
ENV MCENTER_SERVICE_URL=http://127.0.0.1:8010 \
MPAAS_SERVICE_URL=http://127.0.0.1:8080 \
MFLOW_SERVICE_URL=http://127.0.0.1:8090


# 非SSL部署
COPY etc/nginx.conf /etc/nginx/templates/default.conf.template
# SSL 部署
# COPY etc/nginx_ssl.conf /etc/nginx/templates/default.conf.template
# COPY etc/ssl /etc/nginx/ssl

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]