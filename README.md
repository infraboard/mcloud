# mcloud

微服务研发云前端

## 后端服务列表

+ [用户中心](https://github.com/infraboard/mcenter)
+ [发布中心](https://github.com/infraboard/mpaas)
+ [流水线服务](https://github.com/infraboard/mflow)
+ [状态Agent](https://github.com/infraboard/moperator)


## 如何测试WebHook

[ngrok](https://ngrok.com/docs)


## 镜像构建

```sh
docker buildx build  --platform linux/amd64 -t mcloud .
```


### 关于构建环境变量

https://cn.vitejs.dev/guide/env-and-mode.html

