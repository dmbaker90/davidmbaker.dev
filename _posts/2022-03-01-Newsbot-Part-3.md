---
layout: post
author: David
tags: breakingnewsbot
title: Breaking News Bot Development Part 3
comments: true
---

This is the 3rd and final post on my [series](https://www.davidmbaker.dev/tags#tag-breakingnewsbot) about my [Breaking News Bot](https://www.breakingnewsbot.com) App, a news app with a bias slider to observe how political spin changes the narrative of certain topics. This post could also be titled "How Not to Release an App" or "Don't be Lazy". In my [original post](https://www.davidmbaker.dev/2021/11/20/Lets-Create-A-Biased-News-App.html) I mentioned how I used the Bing News API because I was trying to avoid the work of becoming my own news aggregator for this purpose. Both the idea and the code was simple and I didn't want to over complicate it. The pricing of the Bing API at $6 for 1000 api calls is something I new wouldn't scale well but if this didn't generate interest or traffic then it wouldn't matter much anyway. In fact, I had the app up a few months (with miniaml traffic) and received Azure bills for .17 cents / month and .30 cents per month. In order to reduce that potential bill even further I added client-side caching, so any topic/bias combination searched by a client n number of times would only burn 1 api call. In order to determine if I could be done with this app or have to re-engineer it, I posted it on reddit to gauge interest.

## Reddit Response
I posted on the [Sam Harris Subreddit](https://www.reddit.com/r/samharris/comments/sjk3lj/inspired_by_sam_i_made_a_news_page_that_displays/) which I new would have some interest. The response was very positive, but more importantly they went absolutely nuts with the search topics and queries. After about 6 hours I ran up nearly 7K Bing API calls and a $40 Azure bill, so I shut it down.  Also worth noting that my $10 Azure quota notification didn't work, which is a continuing gripe I have with these cloud providers making everything so complicated.

![Bing API](/assets/images/posts/BingAPI.png "Bing API"){:width="100%"}

This wasn't a total surprise but the positive feedback and interest was enough motivation for me to redesign in a more sustainable manner, and update the app based on how they were primarily using it. For instance, the reddit feedback suggested the search bar to pin down bias by topic is really what makes this app interesting. It's now front and center rather than tucked away in the header:

![Search Bar](/assets/images/posts/NewsBotSearch.png "Search Bar"){:width="100%"}

Google Analytics showed over 1,000 active users during this time period, unsurprisingly most from US:

![Analytics](/assets/images/posts/NewsAnalytics.png "Analytics"){:width="100%"}

## New System

Short of subscribing to an existing News API the only option I had was to collect my own news. This means a database and some combination of aggregators to collect data. Then, my app would query my own database obviously at no cost, any number of times. In the end, I ended up with 3 methods. 
1. Nearly every news outlet has an RSS feed still even though RSS seems to be dying. For most sources I can subsribe to the RSS, parse it, and save it for searching later. The [Get RSS Feed](https://github.com/shevabam/get-rss-feed-url-extension) Firefox extension was immensely helpful in finding the RSS feeds for the websites. They were not always available from the site or even by googling (looking at you business insider).
2. Bing News API, but this time using it smartly. With my new database I can now do 1 search and save the results for unlimated use later.
2. Web Scraping. It's fairly easy to load the page in code and parse out headlines and images and save them for later.  The downside to this is that obviously every website is structured differently, so there's not a lot of code re-use.

The new UI also had to handle news items that didn't have an image attached, or the RSS didn't include it. So I added a right-hand column that doesn't show images.  It ends up looking like an editorial column and I think it came out quite nice, very newspaper-esque: [https://www.breakingnewsbot.com/](https://www.breakingnewsbot.com/).

## RSS Hell
RSS is a standard so you'd think it would be pretty trivial to write code to parse an RSS feed and re-use it for every feed.  However, I found nearly every site had differences. For instance, not a single RSS feed in the top 8 used the same image format.
1. NYTimes has a `<media:content>` tag with an image.
2. The Guardian has two of these, but the first one is a minituare thumbnail, so you have to skip it.
3. Fox news has a `<group>` tag with embedded `<media:content>` tags.
4. CNN has a ton of `<media:content>` tags with lots of different image sizes and orientations
5. ABC News uses `<media:thumbnail>` instead.
6. BBC News doesn't even have any pictures in their RSS feed! Agh
7. Digg uses an `<enclosure>` tag for the image
8. NPR has the image embedded inside of an `<content:encoded>` tag using html elements.  Aggh

RSS problems continue even without image standars:
1. Washington post RSS feed does not use standard date formats. I found a workaround thanks to Microsoft Documentation [workaround](https://docs.microsoft.com/en-US/troubleshoot/developer/dotnet/framework/general/rss20feedformatter-throw-exception) but man what the hell.
2. Forbes appears to have RSS feeds that haven't been updated in ages
3. USA today includes clutter in their feeds.  Just "News Items" that link to their categories
4. The Atlantic includes their entire article in the rss feed, not just the description and a link.  That's especially weird since they have a paywall.
5. Bloomberg straight up deliberately removed their RSS feeds.
6. APNews doesn't have one! Bananas. My thought on this one is that other news sources where spamming the RSS feeds of APNews for source material and they shut it down.

After going through so many RSS feeds I do feel like I have very robust code in place to handle every situation. I tried to honor Terms of Use when I saw them, for instance [telegraph.co.uk](https://www.telegraph.co.uk) does not allow you to aggregate and publish the RSS feed.  I don't think that makes sense on their part but I removed their feed anway.  I'm also fairly confident that other aggregators like [NewsCatcherApi](https://newscatcherapi.com/) who also use RSS feeds ignore those warnings.

On a side note I also noticed that the less well known news outlets have more standardized and working rss feeds. My guess is that they are putting more effort into getting their content out there in every possible way, whereas the established sources might not really care about supporting something like a RSS reader.

## Downsides
The downsides to the new system are quite evident. With direct Bing queries, no matter how weird the search is you'll get results and you can do some cool bias comparisons within the app for practically any topic.  With the new system, I am now limited to the data I'm collecting. This'll get better over time as I collect more data but the user experience is objectively worse.  To combat this, I added "seed" data. When I automatically insert a topic, my code will automagiclaly search for material online if I don't have enough content, which can be up to 13 Bing API calls for a topic, or about $.08.  This is working quite well for popular topics, but the more lesser known topics people search for the less sense it makes for me to add seed data, and the less useful the app becomes compared to before.

## Speed and Automation
With my robust RSS reader in place, I run it about every hour and parse about 120 RSS feeds. It takes under a second to parse a feed and save the news items to my database, and under a minute to parse all 120 sources I have.  Even so I don't want to run it more than once an hour as I want my impact of reading these feeds to be super low. My built in Linux RSS reader checks the feeds every 30 minutes, so I decided on half as often as a normal reader to be safe.

To make the queries as fast as possible, all the popular topics are periodically indexed in a many-to-many database table.  Any time new news items are added, they are checked to see if they match any topic key words and then added to the index. This makes the most common search terms super fast.  The less-common search terms still do a full text search of the title and description, however my testing shows these mysql full text searches when filtered by sources and bias are still super fast. I will see how much that slows down as the database expands. 

## Conclusion
My first take away is that RSS feeds are awesome and it's a shame they're dying. I fully intend on using them more. My Linux laptop has abuilt in RSS reader called Akregator that's been working great. I get the headlines and sometimes full stories without any loading pages, clicks, ads, weirdly formatted websites, popups asking me to subscribe, and other annoying stuff.  Second take away is I should probably try harder to engineer things correctly the first time and not retroactively improve it.  I kind of ruined the release of the app by shutting it down after 6 hours the first time.  My last take away is just how profoundly disappointing some of these "news" outlets are. I found myself alternating between "man this is wack, this is great bias for my app" and "I just cannot believe some people consume this as news". It can be quite depressing to see the content at the extremes.  Maybe this app will help someone at least realize what is not news.