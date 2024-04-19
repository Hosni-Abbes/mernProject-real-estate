const { Op } = require('sequelize')
const Article = require('../models/Article')

exports.fetchAll = async (req, res) => {
    const { limit, offset, year } = req.query

    try {
        if(year){
            let articles = await Article.findAll({
                where: { createdAt: {
                    [Op.gte]: year,
                    [Op.lt]: String(parseInt(year)+1 )
                }},
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            return res.status(200).json({articleList: articles })
        }else{
            if(!limit && !offset){
                let articles = await Article.findAll({})
                return res.status(200).json({articleList: articles })
            }else{
                let articles = await Article.findAll({
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                })
                return res.status(200).json({articleList: articles })
            }
        }
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


exports.dashFetchAll = async (req, res) => {
    const { limit, offset } = req.query

    try {
        const articleList = await Article.findAll({})
        const articles = await Article.findAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        })
        return res.status(200).json({articleList: articles, pages: articleList?.length / parseInt(limit) })
            
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


exports.createArticle = async (req, res) => {

    const { title, content } = req.body
    if(!title || !content) return res.status(400).json({message: 'Please add a title and content for your post.'})

    try {
        const article = await Article.create(req.body)

        return res.status(200).json(article)
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


exports.deleteArticle = async (req, res) => {
    const { article } = req.query
    if(!article) return res.status(400).json({message: 'Error! Article not exist'})
    try {
        const getArticle = await Article.findByPk(article)
        if(!getArticle) return res.status(400).json({message: 'Error! Article not exist'})

        // Delete article
        await getArticle.destroy()

        return res.status(200).json({message: 'Article deleted.', articleId:article})

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

exports.updateArticle = async (req, res) => {
    const { article } = req.query
    const { title, content, author } = req.body
    if(!article) return res.status(400).json({message: 'Error! Article not exist'})
    if(!title || !content) return res.status(400).json({message: 'Please add a title and content for your post.'})

    try {
        const getArticle = await Article.findByPk(article)
        if(!getArticle) return res.status(400).json({message: 'Error! Article not exist'})

        // update article
        const articleUpdated = await getArticle.update(req.body)

        return res.status(200).json(articleUpdated)

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}