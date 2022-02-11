The [Get RSS Feed](https://github.com/shevabam/get-rss-feed-url-extension) Firefox extension was immensely helpful in finding the RSS feeds for the websites. They were not always available from the site or even by googling (looking at you business insider).

Which meant individually testing each site

* RSS standars.  Every image tag is different
Not a single RSS feed in the top 5 used the same image format.
NYTimes has a <media:content> tag with an image.
The Guardian two of these, but the first one is a minituare thumbnail, so you have to skip it.
Fox news has a <group> tag with embedded <media:content> tags.
CNN has a ton of <media:content> tags with lots of different image sizes and orientations
ABC News uses <media:thumbnail> instead.
BBC News doesn't even have any pictures in their RSS feed! Agh
Digg uses an <enclosure> tag for the image
NPR has the image embedded inside of an <content:encoded> tag using html elements.  Aggh

The problems continue.
* Washington post RSS feed does not use standard date formats.  There's a [workaround](https://docs.microsoft.com/en-US/troubleshoot/developer/dotnet/framework/general/rss20feedformatter-throw-exception) but I do not really need to save an accurate Publish Date anyway, and I didn't want to build a work around for every source that didn't meet spec.
* Forbes appears to have RSS feeds that haven't been updated in ages
* USA today includes clutter in their feeds.  Just "News Items" that link to their categories
* The Atlantic includes their entire article in the rss feed, not just the description and a link.  That's especially weird since they have a paywall
* Bloomberg straight up deliberately removed their RSS feeds
* APNews doesn't have one!


Mon, 05 Oct 2009 08:00:06 GMT
Tue, 8 Feb 2022 15:20:02 EST


I tried to honor Terms of Use when I saw them, for instance telegraph.co.uk does not allow you to aggregate and publish the RSS feed.  I don't think that makes sense on their part but I removed their feed anway.

Handy dandy regex I wrote

Now I can specifically subscribe to http://rssfeeds.detroitnews.com/detroit/nation and not get local Detroit news, which gives me a good source for .center?... material. A problem I wrote about earlier

I actually think that the less well known news outlets have more standardized and working rss feeds. My guess is that they are putting more effort into getting their content out there in every possible way, whereas the established sources might not really care about something like a RSS reader.