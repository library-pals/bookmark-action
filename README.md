# bookmark-action

This GitHub action bookmarks websites to a YAML file.

Create a new issue with the URL in the title. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your YAML file in your repository, always sorting by the bookmark date.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Add bookmark
on:
  issues:
    types: opened

jobs:
  add_bookmark:
    runs-on: macOS-latest
    name: Add bookmark
    # only continue if issue has "recipe" label
    if: contains( github.event.issue.labels.*.name, 'recipe')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Bookmark action
        uses: katydecorah/bookmark-action@v3.1.1
        with:
          fileName: _data/recipes.yml
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am  "Added ${{ env.BookmarkTitle }} to recipes.yml"
          git push
      - name: Close issue
        uses: peter-evans/close-issue@v1
        with:
          issue-number: "${{ env.IssueNumber }}"
          comment: "You bookmarked ${{ env.BookmarkTitle }} on ${{env.DateBookmarked}}."
```

## Action options

- `fileName`: The filename to save your bookmarks. Default: `_data/bookmarks.yml`.

<!-- END GENERATED DOCUMENTATION -->

## Create an issue

The title of your issue must start with the URL:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
```

The action will automatically set the bookmarked date to today. To specify a different date, add the date after the URL in `YYYY-MM-DD` format:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.
