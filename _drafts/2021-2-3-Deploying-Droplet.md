---
layout: post
author: David
tags: digitalocean linux code angular dotnet
title: Deploy a .NET 6 Webapi and Angular UI to Ubuntu Server
---
This post is going to walk you through how to set up a .NET 6 Web Api backend and Angular Front end application on a $5/month DigitalOcean droplet running Ubuntu 20.04.  More realistically this is going to serve as my own reference when I forget how I configured my server and need to do it again.

My problem was that I had to refer to many different pages and guides to do this.  Rather than repeat everything those guides said, this page is going to be a reference and checklist of which guides to follow and what needs to be done.  But first I wanted to talk you out of this.

## Do you even need to do this?

Not really. This was partly a learning excercise for me.  Plus I wanted to move OFF of Azure onto a server I controlled. Essentially all this configuration can be elimited by doing one of the following:

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
   ![Google Cloud Pricing](/assets/images/posts/GCP1.png "Google Cloud Pricing")
   This type of stuff annoys the shit out of me.  Who is setting up a $38,000 a month server in the same place they set up a $5 / month server?

Alright, let's get started.

## Create your server

## Configure MYSQL
### 
### Create New Users
1. https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

## Fix Angular Routing When Manually Changing URL

Think your done? Think again.  Because Angular handles all url routing within the application itself, if you navigate to your-domain.com/about it'll thrown an NGINX 404 instead of either your angular about page, or your angular 404 page.

* Angular documentation covers this here: https://angular.io/guide/deployment
* All you need to do us update `/etc/nginx/sites-available/your-domain` one last time.  Replace `try_files` with this:

~~~bash
try_files $uri $uri/ /index.html;
~~~

Done
