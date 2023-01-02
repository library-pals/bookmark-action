# bookmark-action

This GitHub action bookmarks websites to a JSON file. Pair it with the [iOS Shortcut](shortcut/README.md) or click **Run workflow** from the Actions tab to submit details for the bookmark.

[Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with basic information about the bookmark. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your JSON file in your repository, always sorting by the bookmark date.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Add bookmark

on:
  workflow_dispatch:
    inputs:
      url:
        description: The URL to bookmark.
        required: true
        type: string
      notes:
        description: Notes about the bookmark.
        type: string
      date:
        description: Date (YYYY-MM-DD). The default date is today.
        type: string

jobs:
  add_bookmark:
    runs-on: macOS-latest
    name: Add bookmark
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Bookmark action
        uses: katydecorah/bookmark-action@v5.0.0
        with:
          fileName: _data/recipes.json
      - name: Download the thumbnail image
        run: curl "${{ env.BookmarkImage }}" -o "img/${{ env.BookmarkImageOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m  "Bookmark ${{ env.BookmarkTitle }}"
          git push
```


## Action options

- `fileName`: The filename to save your bookmarks. Default: `_data/bookmarks.json`.
- `getImage`: Export the URL's `image` to download later and set `image` property. Default: `true`.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{ 
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "url": "", // Required. The URL to bookmark.
    "notes": "", // Notes about the bookmark.
    "date": "", // Date (YYYY-MM-DD). The default date is today.
  }
}
```
<!-- END GENERATED DOCUMENTATION -->
