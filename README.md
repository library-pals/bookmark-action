# bookmark-action

This GitHub action save website metadata to a YAML file.

Create a new issue with the URL in the title. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your YAML file in your repository, always sorting by the date you made the created the bookmark.

## Creating an issue

The title of your issue must start with the URL:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
```

The action will automatically set the date that you made (`date`) to today. To specify a different date, add the date after the URL in `YYYY-MM-DD` format.

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.

## Change the output file

If you'd like to save your bookmark to another file, in the action's `with`, set `fileName` to your desired path.

```yaml
with:
  fileName: "_data/recipes.yml"
```
