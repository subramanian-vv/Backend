const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const ArticleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userfav: {
        type: Array
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

ArticleSchema.pre('validate', function(next) {
    //Creates a URL slug from article title
    if (this.title) {
        this.slug = slugify(this.title, { lower: true,
        strict: true });
    }

    //Converts content to markdown language and sanitizes it
    if(this.content) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.content));
    }

    next();
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;