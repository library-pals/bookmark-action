"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const ogs = require("open-graph-scraper");
const yaml = require("js-yaml");
const { writeFileSync, readFileSync } = require("fs");

async function recipe() {
  try {
    const { title, number, body } = github.context.payload.issue;
    const { url, date } = titleParser(title);
    const fileName = core.getInput("fileName");
    core.exportVariable("IssueNumber", number);
    const recipe = await getMetadata(url, body, date);
    const recipes = addRecipe(fileName, recipe);
    await saveRecipe(fileName, recipes);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getMetadata(url, body, date) {
  return ogs({ url }).then((data) => {
    const { error, result } = data;
    console.log('result', result);
    const { ogUrl, ogTitle, ogDescription, ogSiteName } = result;
    if (error) throw new Error(result);
    core.exportVariable("RecipeTitle", ogTitle);
    core.exportVariable("DateCooked", date);
    return {
      url: ogUrl,
      date,
      title: ogTitle || '',
      description: ogDescription || '',
      site: ogSiteName || '',
      ...body && {notes: body}
    };
  });
}


function titleParser(title) {
  const split = title.split(" ");
  const url = isUrl(split[0]) ? split[0] : undefined;
  if (!url) core.setFailed(`${url} is not valid`);
  const date = isDate(split[1])
    ? split[1]
    : new Date().toISOString().slice(0, 10);
  core.exportVariable("DateCooked", date);
  return {
    url,
    date,
  };
}

// make sure date is in YYYY-MM-DD format
const dateFormat = (date) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
const isDate = (date) => !isNaN(Date.parse(date)) && dateFormat(date);
const isUrl = url => url.startsWith('http');
const sortByDate = (array) =>
  array.sort((a, b) => new Date(a.date) - new Date(b.date));

function addRecipe(fileName, newRecipe) {
  return sortByDate([...yaml.load(readFileSync(fileName, 'utf-8')), newRecipe])
}

async function saveRecipe(fileName, recipes) {
  try {
    writeFileSync(fileName, yaml.dump(recipes), "utf-8");
  } catch (error) {
    core.setFailed(error.message);
  }
}
module.exports = recipe();
