---
layout: post
author: David
tags: digitalocean linux code angular dotnet breakingnewsbot
title: Deploy a .NET 6 Webapi and Angular UI to Ubuntu Server
---

This is part 2 of my [breakingnewsbot.com](breakingnewsbot.com) project. This post is mostly on the infrastructure I used to host it. I will walk you through how to set up a .NET 6 Web Api backend and Angular Front end application on a $5/month DigitalOcean droplet running Ubuntu 20.04. More realistically this is going to serve as my own reference when I forget how I configured my server and need to do it again.

My problem was that I had to refer to many different pages and guides to do this.  Rather than repeat everything those guides said, this page is going to be a reference and checklist of which guides to follow and what needs to be done.  But first I wanted to talk you out of this.

## Do you even need to do this?

Not really. This was mostly a learning excercise for me.  Plus I wanted to move OFF of Azure onto a server I controlled. Essentially all this configuration can be elimited by doing one of the following:

1. Learn docker, then dockerize your app.  Then just install docker on the ubuntu server and run your dockerfile.  Or even easier, use DigitalOceans app service with docker preconfigured.
   * This is a bit easier said than done since everytime I have to dockerize something I feel like I have to relearn it.  So either I'm learning server setup or I'm learning docker again.
2. Use Azure/Aws/GCP app service.  The Azure one specifically is pretty easy to use, you can link up to your github repo and it auto sets up Continuous Integration / Deployment.
   * Keep in mind the free tier of the Azure App Service is borderline useless.  60 minutes of compute time per day, and it takes a while to spin up when you trigger it.  I guess it's fine for hosting a proof of concept app like I was doing in the beginning, but not much else.
   * The next tier up is a $17 month dev server, followed by a $58/month production server.  I think that's kind of ridiculous so I knew I wanted a VM instead.

The true benefits I got out of doing this are:

1. Linux experience. Thanks to this excercise I now feel fairly confortable with linux permissions, symlinks, and the nginx web server.
   * Doing something like this also gives you a good understanding of how the back end infrastructure works, so when you do spin up a cloud App Service in the future you know what it's doing for you automatically and there's no magic.
2. Server flexibility. I can host *multiple* web apps, a database, static websites, and scheduled tasks all on the server I control.
3. Save money.

## DigitalOcean vs Aws/GoogleCloud/Azure

Like I said there are a couple of easier alternatives including the cloud hosted app services.  First I wanted to explain why I went with DO and I'm not even being paid to say this.

1. Their pricing is beautifly simple and transparent.
2. The pricing is *better* than the bigger cloud platforms for small vms. The smallest DO droplet comes with 1GB memory for $5 a month.  Azure is $4.57 for 500MB and Google is $5.49 for 614MB.
3. The giant cloud platforms have the smaller VMs buried in hundreds of server configurations and pricing options.  Everything is clearly targeted to any granular configuration an enterprise might need.
4. The giant cloud platforms have so many options that the pricing changes violently when you click anything.  Look at what happened when I accidentally clicked "Memory Optimized" while setting up my $5 Google Cloud VM.
   ![Google Cloud Pricing](/assets/images/posts/GCP1.png "Google Cloud Pricing"){:width="100%"}

   This type of stuff annoys the shit out of me.  Who is setting up a $38,000 a month server in the same place they set up a $5 / month server?

Anyway, that's the type of stuff that leads me to the simplicity of Digitial Ocean. Alright, let's get started.

## Create your server
1. Refer to this documentations: [Set up a Production-Ready Droplet ](https://docs.digitalocean.com/tutorials/recommended-droplet-setup/)


**Recommendations**
1. Don't use the linux firewall `ufw`.  I recommend using the Cloud Digital Ocean networking firewall.  Keeps you from [locking yourself out](https://www.davidmbaker.dev/2022/02/01/Digital-Ocean-Firwall.html)
2. Take a snapshot within Digital Ocean once you're done with configuration.

## Configure MYSQL
### Install
~~~ps
sudo apt-get install mysql-server
sudo mysql_secure_installation utility
cd /etc/mysql/mysql.conf.d
nano mysqld.cnf
-- change binding address from localhost to 0.0.0.0 to open up mysql to remote
sudo systemctl start mysql
~~~
### Create MySql Service
~~~ps
sudo systemctl enable mysql
sudo systemctl restart mysql
~~~
### Create Database and User
Refert to this documentation: [How To Create a New User and Grant Permissions in MySQL](https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql)
~~~sql
mysql -u root -p
CREATE DATABASE *mydb*;
CREATE USER 'dave'@'%' IDENTIFIED BY 'password';
GRANT ALL ON NEWS.* TO 'dave'@'%';
FLUSH PRIVILEGES;
~~~
**Recommendations**
1. Create a non-root mysql super-user with all permissions.  Use this account instead of root in general.
2. Create a writer-user, with read/write acces to all tables in this new database.  Cannot configure users.
3. Create a reader-user, with only read access to all tables in this database. Use this for any access that doesn't need write.  In my case my UI and WebAPI only need read.

## Setup FTP
It's unclear to me how several guides were able to FTP after setting up their droplet without further configuration.  I had to follow this entire tutorial: [How To Set Up vsftpd for a User's Directory on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-for-a-user-s-directory-on-ubuntu-18-04) to get FTP support. The gist is:
1. Install `vsftp`
2. Open up firewall ports 20 tcp, 21 tcp, 990 tcp, 40000-50000tcp
3. Configure /home/user/ftp permissions.  The idea here is to restrict the ftp users write access to a specific subfolder.
4. Configure FTP access in `/etc/vsftpd.conf` 
 4.1 write_enable = YES;
 4.2 chroot_local_user = YES;
 4.3 Configure directory
 4.4 Configure ports
 4.5 Configure and create whitelist
5. Configure TLS and create a certificate, update `/etc/vsftpd.conf`
6. `sudo systemctl restart vsftpd`
2. After this you should be able to uze FileZilla with options `use FTP` and `Require Explicit FTP over TLS`

## Install Dotnet Runtime
Reference this documentation: [Deploy our ASP.NET Core 3.1 app to Ubuntu](https://driesdeboosere.dev/blog/how-to-deploy-aspnet-core-31-app-to-digital-ocean-linux-droplet/#deploy-our-asp.net-core-3.1-app-to-ubuntu)
* The above is also a nice complete guide to this whole process as well. I referred to it several times, but there were things that didn't work to me such as FTP configuration. Which is why I'm aggregating the guides I used in this post.
* Also reference the original Microsoft Docs: [Install the .NET SDK or the .NET Runtime on Ubuntu](https://docs.microsoft.com/en-us/dotnet/core/install/linux-ubuntu#2104-)

~~~ps
wget https://packages.microsoft.com/config/ubuntu/21.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
~~~
~~~ps
sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y aspnetcore-runtime-6.0
~~~

## Deploy .NET WebAPI and Angular UI
On the Server, create the /var/www/ folder where we will host our apps.
~~~ps
sudo mkdir /var/www/
sudo chown -R dave:www-data /var/www/
~~~
Also create the 2 directories we will use to host our WebAPI backend, and Angular front end:
~~~ps
sudo mkdir /var/www/api.domain.com
sudo mkdir /var/www/domain.com
~~~
### Deploy WebAPI
1. Build in release mode: `dotnet publish -c Release`
2. FTP to ubuntu using `ftpuser` and FileZilla to `/home/ftpuser/ftp/files`
3. In Ubuntu, move the files over to the new `/var/www/api.domain.com`

### Deploy UI
1. Build the Angular app in production mode: `ng build`
2. FTP to Ubuntu using `ftpuser` and FileZilla to `/home/ftpuser/ftp/files`
3. In Ubunto, move the files over to the new `/var/www/domain.com`

### Update Permissions
We need to grant all to ourselves, and execute to `www-data`
~~~ps
sudo chown -R dave:www-data /var/www/api.domain.com
sudo chmod -R 755 /var/www/api.domain.com/
sudo chown -R dave:www-data /var/www/domain.com
sudo chmod -R 755 /var/www/domain.com/
~~~

## Configure NGINX
1. Follow the official nginx documentation to install on Ubuntu: [Official Debian/Ubuntu packages](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)#official-debian-ubuntu-packages
2. Setup Server Blocks, we are going to need one for the api and one for the UI: [How To Install Nginx on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04#step-5-%E2%80%93-setting-up-server-blocks-recommended)
 * I needed this fix on Ubuntu: [StackOverflow](https://stackoverflow.com/questions/17413526/nginx-missing-sites-available-directory/17415606#17415606)
 * If you have a domain, in order to use api.domain.com create an `api` subdomain like the one in this example: [Install an ASP.NET Core Web API on Linux](https://hbhhathorn.medium.com/install-an-asp-net-core-web-api-on-linux-ubuntu-18-04-and-host-with-nginx-and-ssl-2ed9df7371fb)
 * This is going to create symlinks between `sites-available` and `sites-enabled`.  You can sever the link to disable it but keep the configuration in `sites-available`
   - Enable: `sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/`
   - Disable: `sudo rm /etc/nginx/sites-enabled/example.com`
   - `sudo systemctl reload nginx`
3. Secure NGINX with LetsEncrypt and Certbot: [How To Secure Nginx with Let's Encrypt on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)
4. Finish configuring the Web Server (Step 4 of this link), and setup a `systemctl` service for the .net core app: [How To Deploy an ASP.NET Core Application with MySQL Server Using Nginx on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-deploy-an-asp-net-core-application-with-mysql-server-using-nginx-on-ubuntu-18-04)

~~~ps
cd /etc/systemd/system
sudo nano api.domain.com.service
~~~

~~~ps
[Unit]
Description=API Domain app

[Service]
WorkingDirectory=/var/www/api.domain.com
ExecStart=/usr/bin/dotnet /var/www/api.domain.com/api.domain.dll
Restart=always
RestartSec=10
SyslogIdentifier=movie
User=sammy
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
~~~
Enable:
~~~ps
sudo systemctl enable api.domain.com.service
~~~
Start it:
~~~ps
sudo systemctl start api.domain.com.service
~~~
Check status:
~~~ps
sudo systemctl status api.domain.com.service
~~~

## Fix Angular Routing When Manually Changing URL

Think your done? Think again.  Because Angular handles all url routing within the application itself, if you navigate to your-domain.com/about it'll thrown an NGINX 404 instead of either your angular about page, or your angular 404 page.

* Angular documentation covers this here: [Angular Deployment](https://angular.io/guide/deployment)
* All you need to do us update `/etc/nginx/sites-available/your-domain` one last time.  Replace `try_files` with this:

~~~ps
try_files $uri $uri/ /index.html;
~~~

## Logging
This may be helpful when debugging errors in the running .net core service:
~~~ps
sudo journalctl -fu {your-service-name}.service
~~~
Nginx Access Log: Every request to your web server is recorded in this log file 
~~~ps
/var/log/nginx/access.log
~~~
Nginx Error Log: Any Nginx errors will be recorded in this log.
~~~ps
/var/log/nginx/error.log: 
~~~



Done
