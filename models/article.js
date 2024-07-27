const mongoose=require('mongoose')
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
const articleSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    title:{
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML:{
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next){
    if(this.username){
        this.slug = slugify(this.username,{lower:true, strict: true})
    }
    if(this.title){
        this.sanitizedHTML= dompurify.sanitize(marked(this.title))
    }

    next()

 
})


module.exports = mongoose.model('Article',articleSchema)