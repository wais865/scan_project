
exports.indexFiles = (req, res, next) =>{
    res.render('index', 
    {   
        title: 'index page',
        description: 'index description'     
    });
};