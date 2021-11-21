You have two options when building a SPA with a .net core back end.

Bundled:
- Single code base
- Can deploy to a single Azure Web App
- You can change environment variables on the fly during deployment for both the server and the front end app.  For instance, if you use Azure Deployment swaps, basically you can deploy to Slot A, you can on the fly update your web app to use .net core API slot A.  If you deploy to Slot B, you can use slot B.  This allows you to seemlesly deploy without downtime and point the app to the right slot. Basically having a Staging slot and a Production slot, that can switch back and forth.

If you were using static sites, your Web App probably has a single "Production" web api URL it's configured to use.  It cannot switch between Slot A and Slot B.  


Isolated:
- cleaner to have a UI independent of 
- Using the Azure static sites is fast, saves resources on the web app



https://stackoverflow.com/questions/61423155/how-to-access-the-azure-web-app-configuration-in-a-static-web-page