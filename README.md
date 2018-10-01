# Service Bot Installation Guide
Open-source subscription management & billing automation system

## Production

TODO: OpenShift

## Staging

Deploy ebilling with docker.

On new linux server, install:

```bash
# Install guide: 'docs/docker.md'
docker
docker-compose

nginx
certbot
node
```

Using o2o-box to deploy ebilling (run as `root`):

TODO: Deploy as `ubuntu`

```bash
# Run as root
cd packages/o2o-box
npm install
# Deploy ebillling
# service <service>
sudo node src/index.js service servicebot
```

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


## Handle PostgreSQL

We often face with 3 cases:

+ [1] Native/RDS PosgreSQL
+ [2] From other docker
+ [3] Dont have any PostgreSQL

|   	| Case                               	| How to                                                      	|
|---	|------------------------------------	|-------------------------------------------------------------	|
| 1 	| Native/RDS PostgrSQL already exist 	| + Remove docker's service in yaml file which run PostgreSQL 	|
|   	|                                    	| + Update PostgreSQL config of client                        	|
| 2 	| From other docker                  	| + Joining exist PostgresSQL Docker using network            	|
|   	|                                    	| + Sample conf [db](docker-compose-db.yml)                   	|
| 3 	| Dont have any PosgreSQL            	| + Current yaml file support create new PostgreSQL           	|
|   	|                                    	| + Reuse & Update user, pass & database's name conf          	|

## Prerequisites
- Ubuntu Server (At least 16.04)
- NodeJS >= 8.9.1 (LTS version)
- PM2
- Postgresql 9+

## Remote to your server
```bash
ssh user@ip-address
```

After connected to your server, make sure you are on the home directory.
```bash
cd ~
```

## Setup basic environment

```bash
git clone https://github.com/o2oprotocol/devops.git
```

Switch working directory to `devops`
```bash
cd ~/devops
```

Upgrade ubuntu packages & install some new packages
```bash
./1.ubuntu-upgrade.sh
```

If you see the popup which show information about `configuring grub-pc`, just press `ENTER` key.

Be patient. This task will take a while.

## Install postgresql
```bash
sudo apt-get update &&
sudo apt-get install postgresql postgresql-contrib
```

## Create postgres database, credentials

Create user
```bash
sudo -u postgres createuser servicebot
```

Create database
```bash
sudo -u postgres createdb servicebotdb
```

Giving the user a password
```bash
sudo -u postgres psql
psql=# alter user servicebot with encrypted password 'Abcd@1234';
```

Granting privileges on database
```bash
psql=# grant all privileges on database servicebotdb to servicebot;
```

After doing all above steps, close the `psql=#` REPL by pressing `CTRL+D`

Test the connection by:
```bash
psql -h localhost -U servicebot servicebotdb -W
```

Enter the password above `servicebot`

If you connect success and terminal shows `servicebot=>` means you are doing well.

Press `CTRL+D` to quit the terminal.


## Double check your environments are correct.
### Check nodejs version
```bash
node -v
```

Make sure the nodejs version is greater or equals `8.9.1` (It can be `8.11.1`)

The result could be: `v8.11.2`

### Check the `pm2` is present and 
```bash
pm2 -v
```

The result could be: `2.10.4`

## Clone source code

Switch working directory to home directory (~)
```bash
cd ~
```

Clone source code
```bash
git clone https://vbosstech@bitbucket.org/eworkforce/ebilling.git
```

## Create environment variables

Export application variables.
*Make sure that you replace email information by your information.*
```bash
 echo "export POSTGRES_DB_HOST=localhost            
 export POSTGRES_DB_USER=servicebot                 
 export POSTGRES_DB_NAME=servicebotdb               
 export POSTGRES_DB_PASSWORD=Abcd@1234              
 export POSTGRES_DB_PORT=5432                       
 export ADMIN_USER=thanh.nn@tctav.com               
 export ADMIN_PASSWORD=Abcd@1234                    
 export ADMIN_NAME=Admin                            
 export VIRTUAL_HOST=127.0.0.1                      
 export SECRET_KEY=Q45Gpb2vkiYGoBi5jDz8mcWlmmFWgVbk 
 export SMTP_HOST=mail.tctav.com                    
 export SMTP_USER=thanh.nn@tctav.com                
 export SMTP_PASSWORD=servicebot                    
 export SMTP_PORT=587" >> ~/.bash_profile
```

Apply changing for env
```bash
source ~/.bash_profile
```


## Build & Run Ebilling

Switch working directory to `ebilling` directory
```bash
cd ~/ebilling
```

Execute `yarn` to install dependencies
```bash
yarn
```

Build source
```bash
yarn build
```

Start `ebilling` application
```bash
PORT=3334 pm2 --name=ebilling start npm -- start 
```

## Allow Port if not

If you are using firewall, please make sure that port `3334` is allowed.
```bash
sudo ufw allow 3334
```

**Enjoy your great things by browse app at: http://your-ip-address:3334**

## Features
- **Automate Billing:** Create and sell anything as a service in minutes.
    - **Service designer:** Design service offerings that link directly to Stripe.
    - **Subscription management:** Supports automatic recurring charges.
    - **Quote system:** You can allow your customers to request quotes for your services before charging them.
    - **Free trials:** Give out free trials of your subscription offerings to your customers.
    - **Add-ons and Upsell:** Add custom fields to your service request form which influence the final price.
    - **Adding charges:** Add one-time charges to a running service for custom work your clients want.
    - **Refunds:** You can issue partial or full refunds on your customer invoices.
    
- **Manage Customers:**.
    - **Store-front:** Let your customers order from your catalog without needing another website.
    - **Automatic invoicing:** Invoices are generated and sent to customers automatically.
    - **Service cancellations:** Customers can request cancellations.
    - **RBAC:** Customize roles for staff 
    - **Communication:** Customers can send your business messages when they have questions

- **Extensibility:**
    - **Full REST API:** Integrate BnBService with your existing website or application
    - **Plugin framework:** Develop plugins to extend the functionality of bnbservice (documentation coming soon)

> JENKINS



```
npm install

rm -rf .env

# BnB Config
export PORT=3334
export SSL_PORT=3200
export POSTGRES_DB_HOST=localhost            
export POSTGRES_DB_USER=ebilling                 
export POSTGRES_DB_NAME=ebillingdb               
export POSTGRES_DB_PASSWORD=devops2018              
export POSTGRES_DB_PORT=5432                       
export ADMIN_USER=thanh.nn@tctav.com               
export ADMIN_PASSWORD=devops2018                    
export ADMIN_NAME=Admin                            
export VIRTUAL_HOST=127.0.0.1                      
export SECRET_KEY=Q45Gpb2vkiYGoBi5jDz8mcWlmmFWgVbk 
export SMTP_HOST=mail.tctav.com                    
export SMTP_USER=thanh.nn@tctav.com                
export SMTP_PASSWORD=devops2018                    
export SMTP_PORT=587

npm run build

# Keep process
export BUILD_ID=dontKillMe

pm2 delete eBilling || true
pm2 start --name=eBilling npm -- start

pm2 save
pm2 startup || true
```