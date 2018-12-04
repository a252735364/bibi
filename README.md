币比源码说明
============

币比是SEER运营团队打造的一款“样板房”式的DAPP，同时也起到SEER手机钱包的作用。SEER用户可以使用币比来参与各种主题的预测，使用SEER的各项功能。社区开发者也能通过币比来了解基于SEER的DAPP开发。

币比也是一个开源项目，对于开发者来说，币比是一个开发验证和实验的工具。币比开发团队将使用目前移动端常用的webapp、安卓原生、IOS原生等技术分别对币比进行实现。

此处开源的是币比的webapp版本，按照以下说明操作，将在您的设备上构建热加载的开发模式服务端，或是生成生产环境用于部署到服务器。

webapp可以方便的在各种平台上使用，同时也可以用于和其他项目方合作，植入到其他App内部。

币比同时也是一个连接 Seer API 的手机轻钱包，在SEER-UI的基础上开发。Seer API 由 *witness_node* 程序提供。

这个钱包*将所有的密钥存储在本地浏览器上*，*不会把你的密钥暴露给任何人*，因为它会先在本地对交易签名，再传输到 API 服务器上，由服务器广播至区块链网络。钱包由用户选择的密码加密并储存在浏览器数据库中。

## 项目依赖

币比 依赖于 Node.js v6 以上版本。

在 Linux 和 macOS 上，安装 Node 最简单的方式是用 [NVM](https://github.com/creationix/nvm)。

将以下命令复制到终端中执行即可安装 NVM。

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
nvm install v6
nvm use v6
```

Node 安装完成后，获取项目的源代码：

```
git clone https://github.com/a252735364/bibi.git
cd bibi
```

在启动之前，需要先安装 npm 软件包：

```
npm install
```

## 运行开发服务器

开发服务器使用 Express 和 Webpack。

所有软件包安装好后，可以使用以下命令启动开发服务器：

```
npm start
```

编译完成后，即可通过浏览器访问 `localhost:3000` 或 `127.0.0.1:3000` 打开钱包。服务器启用了热加载功能，在编辑源文件后，浏览器中的内容会实时更新。

## 生产环境
如果你想自己部署基于币比源码的webapp钱包，你应该进行生产环境构建，并使用 NGINX 或 Apache 托管。只需要运行以下命令构建生产环境应用包：

```
npm run build
```

应用包会创建在 `build/dist` 目录下，可以使用网站服务器进行托管。

## 币比资源

币比页面资源在 app/src 目录下，您可以自行修改。