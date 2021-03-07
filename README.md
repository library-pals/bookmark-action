# recipe-box-action

This GitHub action tracks the recipes that you've made by updating the `_data/recipes.yml` file in your repository.

Create a new issue with the recipe's URL in the title. The action will then fetch the recipe's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to `_data/recipes.yml` in your repository, always sorting by the date you made the recipe.

## Creating an issue

The title of your issue must start with the URL of the recipe:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
```

The action will automatically set the date that you made (`date`) to today. To specify a different date, add the date after the URL in `YYYY-MM-DD` format.

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.

## Change the output file

If you'd like to save your recipes to another file, in the action's `with`, set `fileName` to your desired path.

```yaml
with:
  fileName: "archive/recipes.yml"
```
