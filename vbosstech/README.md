# ServiceBot Installation Guide
Open-Source Bot-as-a-Service BaaS Subscription Management & Billing Automation.

## 1. Configuration Environment

### 1.1. Prerequisites
- Ubuntu Server 16.04 LTS
- NodeJS >= 8.10.0 (AWS Lambda support)
- PM2
- PostgreSQL 9+

## 1.2. Upgrade Ubuntu & install NGINX & CertBot/SSL

```bash
  git clone https://github.com/vbosstech/devops.git
  cd ~/devops
  ./S0.os-upgrade.sh
```

### 1.3. Configuring PostgreSQL

In general, there are 3 cases:

+ [x] 1. AWS RDS or Native PosgreSQL
+ [ ] 2. [Docker-Shared] mount-data from other Docker
+ [ ] 3. [Docker-New] Don't have any PostgreSQL

|   	| Case                               	| How to                                                      	|
|---	|------------------------------------	|-------------------------------------------------------------	|
| 1 	| Existing Native/RDS PosgreSQL   	    | + Remove Docker's service in `*.yaml` file which run PostgreSQL 	|
|   	|                                    	| + Update PostgreSQL config of Client                        	|
| 2 	| Shared from other Docker             | + Joining exist PostgresSQL Docker using network            	|
|   	|                                    	| + Sample conf `[db](docker-compose-db.yml)`                   |
| 3 	| Don't have any PosgreSQL            	| + Current `*.yaml` file support create new PostgreSQL           	|
|   	|                                    	| + Reuse & update user, pass & database's name conf          	|


### 1.4. Installing & Configuring PosgreSQL

```bash
  cd ~/devops/scripts
  ./postgresql.sh
```

- Create PosgreSQL database, credentials

```bash
  sudo -u postgres createuser servicebot
  sudo -u postgres createdb servicebotdb
```  

- $ `sudo -u postgres psql`
 
```
  psql=# alter user servicebot with encrypted password 'YourPassword';
  psql=# grant all privileges on database servicebotdb to servicebot;
```

- After doing all above steps, close the `psql=#` REPL by pressing `CTRL+D`. Test the connection by:

```bash
psql -h localhost -U servicebot servicebotdb -W
```

## 2. Clone source-code from GitHub

```bash
  git clone https://github.com/vbosstech/servicebot.git
```

### 2.1. Create environment variables

```bash
   echo "export POSTGRES_DB_HOST=localhost            
   export POSTGRES_DB_USER=servicebot                 
   export POSTGRES_DB_NAME=servicebotdb               
   export POSTGRES_DB_PASSWORD=YourPassword              
   export POSTGRES_DB_PORT=5432                       
   export ADMIN_USER=vbosstech@gmail.com               
   export ADMIN_PASSWORD=YourPassword                    
   export ADMIN_NAME=Admin                            
   export VIRTUAL_HOST=127.0.0.1                      
   export SECRET_KEY=YourSecretKey 
   export SMTP_HOST=smtp.google.com                    
   export SMTP_USER=vbosstech@gmail.com                
   export SMTP_PASSWORD=servicebot                    
   export SMTP_PORT=587" >> ~/.bash_profile
```

Apply changing for env
```bash
source ~/.bash_profile
```

### 2.2. Build & Run Ebilling

```bash
  cd ~/servicebot
  yarn
  yarn build
```

- Start `servicebot` application

```bash
  sudo ufw allow 3333
  PORT=3333 pm2 --name=servicebot start npm -- start 
```

## 3. JENKINS

```
npm install

rm -rf .env

# ServiceBot Config
export PORT=3333
export SSL_PORT=3200
export POSTGRES_DB_HOST=localhost            
export POSTGRES_DB_USER=servicebot                 
export POSTGRES_DB_NAME=servicebotdb               
export POSTGRES_DB_PASSWORD=YourPassword              
export POSTGRES_DB_PORT=5432                       
export ADMIN_USER=vbosstech@gmail.com               
export ADMIN_PASSWORD=YourPassword                    
export ADMIN_NAME=Admin                            
export VIRTUAL_HOST=127.0.0.1                      
export SECRET_KEY=YourSecretKey 
export SMTP_HOST=smtp.google.com                    
export SMTP_USER=vbosstech@gmail.com                
export SMTP_PASSWORD=YourPassword                    
export SMTP_PORT=587

npm run build

# Keep process
export BUILD_ID=dontKillMe

pm2 delete ServiceBot || true
pm2 start --name=ServiceBot npm -- start

pm2 save
pm2 startup || true
```

## 4. Upgrade the latest open-source:

```
  cd /Volumes/vBOSS/github/servicebot                                              &&
  cd  servicebot                                                                   &&
  git remote add upstream https://github.com/service-bot/servicebot.git            &&
  git fetch upstream                                                               &&
  git pull upstream master                                                         && 
  
  cd ../servicebot-billing-settings-embed                                                       &&
  git remote add upstream https://github.com/service-bot/servicebot-billing-settings-embed.git  &&
  git fetch upstream                                                                            &&
  git pull upstream master                                                                      &&

  cd ../servicebot-checkout-embed                                                               &&
  git remote add upstream https://github.com/service-bot/servicebot-checkout-embed.git          &&
  git fetch upstream                                                                            &&
  git pull upstream master                                                                      &&

  cd ../servicebot-base-form                                                       &&
  git remote add upstream https://github.com/service-bot/servicebot-base-form.git  &&
  git fetch upstream                                                               &&
  git pull upstream master                                                         &&

  cd ../servicebot-docs                                                            &&
  git remote add upstream https://github.com/service-bot/servicebot-docs.git       &&
  git fetch upstream                                                               &&
  git pull upstream master                                                         &&

  cd  ../pluginbot                                                                 &&
  git remote add upstream https://github.com/service-bot/pluginbot.git             &&
  git fetch upstream                                                               &&
  git pull upstream master                                                         &&

  cd ../pluginbot-react                                                            &&
  git remote add upstream https://github.com/service-bot/pluginbot-react.git       &&
  git fetch upstream                                                               &&
  git pull upstream master                                                         &&
  
  cd ../servicebot-client                                                          &&
  git remote add upstream https://github.com/service-bot/servicebot-client.git     &&
  git fetch upstream                                                               &&
  git pull upstream master      
  
  npm publish --access=public                                     
```