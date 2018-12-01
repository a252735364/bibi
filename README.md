币比是SEER运营团队打造的一款“样板房”式的DAPP，同时也起到SEER手机钱包的作用。SEER用户可以使用币比来参与各种主题的预测，使用SEER的各项功能。因为币比是一个开源项目，社区开发者也能通过币比来了解基于SEER的DAPP开发。

币比将所有的密钥存储在本地浏览器上，不会把你的密钥暴露给任何人，因为它会先在本地对交易签名，再传输到 API 服务器上，由服务器广播至区块链网络。密钥由用户选择的密码加密并储存在浏览器数据库中。

币比前端采用react开发，在Seer-Ui的基础上增加了币比的页面应用，相关页面资源在 app/src 目录下。

你可以通过以下流程构建一个币比的服务端：

## 项目依赖

币比 依赖于 Node.js v6 以上版本。

在 Linux 和 macOS 上，安装 Node 最简单的方式是用 NVM。

将以下命令复制到终端中执行即可安装 NVM。
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
nvm install v6
nvm use v6
```
Node 安装完成后，获取项目的源代码：
```
git clone https://github.com/a252735364/ytf.git
cd ytf
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
编译完成后，即可通过浏览器访问 localhost:3000 或 127.0.0.1:3000 打开钱包。

