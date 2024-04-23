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
docker run --restart=always --name mcenter --network host -itd registry.cn-hangzhou.aliyuncs.com/infraboard/mcenter:v0.0.1
#
docker run --restart=always -e MCENTER_GRPC_ADDRESS="127.0.0.1:18010" \
 -e MCENTER_CLINET_ID="" \
 -e MCENTER_CLIENT_SECRET="" \
```