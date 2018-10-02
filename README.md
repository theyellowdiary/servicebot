# Service-Bot Installation Guide
Open-Source Bot-as-a-Service BaaS Subscription Management & Billing Automation.

> **LIVE Demo**
> [https://servicebot.vboss.tech](https://servicebot.vboss.tech)

## 1. Features
- **Automate Billing:** Create and sell Bot as a Service in minutes.
    - **Service Designer:** Design service offerings that link directly to Stripe.
    - **Subscription Management:** Supports automatic recurring charges.
    - **Quote System:** You can allow your customers to request quotes for your services before charging them.
    - **Free Trials:** Give out free trials of your subscription offerings to your customers.
    - **Add-ons and Up-Sell:** Add custom fields to your service request form which influence the final price.
    - **Adding Charges:** Add one-time charges to a running service for custom work your clients want.
    - **Refunds:** You can issue partial or full refunds on your customer invoices.
    
- **Manage Customers:**.
    - **Store-Front:** Let your customers order from your catalog without needing another website.
    - **Automatic Invoicing:** Invoices are generated and sent to Customers automatically.
    - **Service Cancellations:** Customers can request cancellations.
    - **RBAC:** Customize roles for staff 
    - **Communication:** Customers can send your business messages when they have questions

- **Extensibility:**
    - **REST-API:** Integrate BnBService with your existing website or application
    - **Plugin Framework:** Develop plugins to extend the functionality of ServiceBot

## 2. Installation & Configuration

### 2.1. Native Deployment - Ubuntu 16.04 LTS 

- Start [PostgreSQL Database](vbosstech/servicebot-dev/postgres.bat)
- Inject [environment variables](vbosstech/servicebot-dev/.env.bat)
- Start app's server
```bash
yarn start
```
- Start Dev-UI
```bash
yarn dev-client
```

### 2.2. Docker Deployment

- [Install `Docker`](vbosstech/docs/docker.md)
- Option: `nginx` & `certbot`
- Deploy (run as `root`):
```bash
  cd vbosstech/servicebot-docker
  npm install
  sudo node src/index.js service servicebot
```

## 2.3. Production

TODO: `Kubernetes` & `OpenShift`