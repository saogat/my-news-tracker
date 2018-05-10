var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
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

// This creates our model from the above schema, using mongoose's model method
var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

// Export the Article model
module.exports = SavedArticle;
