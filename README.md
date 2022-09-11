# bookmark-action

This GitHub action bookmarks websites to a JSON file. Pair it with the [iOS Shortcut](shortcut/README.md).

[Create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with basic information about the bookmark. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your JSON file in your repository, always sorting by the bookmark date.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Add bookmark
on:
  repository_dispatch:
    types: [bookmarks]

jobs:
  add_bookmark:
    runs-on: macOS-latest
    name: Add bookmark
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Bookmark action
        uses: katydecorah/bookmark-action@v3.1.3
        with:
          fileName: _data/recipes.json
      - name: Download the thumbnail image
        run: curl "${{ env.BookmarkImage }}" -o "img/${{ env.BookmarkImageOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m  "Added ${{ env.BookmarkTitle }} to recipes.json"
          git push
```

## Action options

- `fileName`: The filename to save your bookmarks. Default: `_data/bookmarks.json`.

<!-- END GENERATED DOCUMENTATION -->

## Send an event

To trigger the action, you will [create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with information about the book.

The [iOS Shortcut](shortcut/README.md) helps format and send the event.

### Payload

```js
{
  "event_type": "bookmarks", // Optional. This helps you filter events in the workflow, in case you have more than one.
  "client_payload": {
    "url": "", // Required. The URL to be bookmarked.
    "date": "", // Optional. The date you saved the bookmark in YYYY-MM-DD format. The default it today's date.
    "notes": "" // Optional. Notes about the bookmark.
  }
}
```
