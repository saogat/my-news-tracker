var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavedArticleSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }]
});

var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

module.exports = SavedArticle;
