# bookmark-action

This GitHub action bookmarks websites to a YAML file.

Create a new issue with the URL in the title. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your YAML file in your repository, always sorting by the bookmark date.

## Set up

Create `.github/workflows/bookmarks.yml` file using the following template:

<!-- START GENERATED SETUP -->
```yml
name: Add bookmarks
on:
  issues:
    types: opened

jobs:
  update_bookmark:
    runs-on: macOS-latest
    name: Add bookmark
    # only continue if issue has "bookmark" label
    if: contains( github.event.issue.labels.*.name, 'bookmark')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Bookmark action
        uses: katydecorah/bookmark-action@2.0.0
        with:
          fileName: _data/bookmarks.yml
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "Updated _data/bookmarks.yml"
          git push "https://${GITHUB_ACTOR}:${{secrets.GITHUB_TOKEN}}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF}
      - name: Close issue
        uses: peter-evans/close-issue@v1
        with:
          issue-number: "${{ env.IssueNumber }}"
          comment: "You bookmarked ${{ env.BookmarkTitle }} on ${{env.DateBookmarked}}."

```

<!-- END GENERATED SETUP -->

## Options

<!-- START GENERATED OPTIONS -->
- `fileName`: The filename to save your bookmarks. Default: `_data/bookmarks.yml`.

<!-- END GENERATED OPTIONS -->


## Create an issue

The title of your issue must start with the URL:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
```

The action will automatically set the bookmarked date to today. To specify a different date, add the date after the URL in `YYYY-MM-DD` format.

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.

