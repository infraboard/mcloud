# 安装

每个服务独立添加用户
```sh
use mcenter
db.createUser({user: "mcenter", pwd: "123456", roles: [{ role: "dbOwner", db: "mcenter" }]})

use mflow
db.createUser({user: "mflow", pwd: "123456", roles: [{ role: "dbOwner", db: "mflow" }]})
```

```sh
# mongodb
docker run --restart=always --name mongo --network host -itd mongo
# mcenter
docker run --restart=always \
-e GRPC_HOST="10.0.8.3" \
-e LOG_LEVEL=debug \
--name mcenter --network host -itd registry.cn-hangzhou.aliyuncs.com/infraboard/mcenter:v0.0.1
# mpaas
docker run --restart=always \
-e GRPC_HOST="10.0.8.3" \
-e MCENTER_GRPC_ADDRESS="10.0.8.3:18010" \
-e MCENTER_CLINET_ID="9aO8ewL35g9y8Hah2KL3euT3" \
-e MCENTER_CLIENT_SECRET="FGbHIrlLIQasbS9OvForb0zVBDoBUwhH" \
--name mpaas \
--network host \
-itd registry.cn-hangzhou.aliyuncs.com/infraboard/mpaas:v0.0.1
# mflow
docker run --restart=always \
-e GRPC_HOST="10.0.8.3" \
-e MCENTER_GRPC_ADDRESS="10.0.8.3:18010" \
-e MCENTER_CLINET_ID="cXpqAUXOzL8hPPWigOZSGb4m" \
-e MCENTER_CLIENT_SECRET="FnenI1Pm6kIio3J3PehWYkiAOdIlsDLm" \
--name mflow \
--network host \
-itd registry.cn-hangzhou.aliyuncs.com/infraboard/mflow:v0.0.1
# mcloud
docker run --restart=always \
--name mcloud \
--network host \
-itd registry.cn-hangzhou.aliyuncs.com/infraboard/mcloud:v0.0.1
# moperator
docker run --restart=always \
-e GRPC_HOST="10.0.8.3" \
-e MCENTER_GRPC_ADDRESS="10.0.8.3:18010" \
-e MCENTER_CLINET_ID="cXpqAUXOzL8hPPWigOZSGb4m" \
-e MCENTER_CLIENT_SECRET="FnenI1Pm6kIio3J3PehWYkiAOdIlsDLm" \
-v /etc/rancher/k3s/k3s.yaml:/root/.kube/config \
--name moperator \
--network host \
-itd registry.cn-hangzhou.aliyuncs.com/infraboard/moperator:v0.0.1
```

## 关于证书

[acme.sh](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

```sh
./acme.sh --install -m email=719118794@qq.com
```


```
./acme.sh --issue --dns -d console.mdev.group \
 --yes-I-know-dns-manual-mode-enough-go-ahead-please
./acme.sh --renew -d console.mdev.group \
  --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

