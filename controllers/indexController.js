/* GET /index home page. */
exports.indexFiles = (req, res, next) =>{
    res.render('index', 
    {   
        title: 'index page',
        description: 'index description'     
    });
};

/* GET /dashboard dashboard page. */
exports.dashboardFiles = (req, res, next) =>{
    res.render('index', 
    {   
        title: 'dashboard page',
        description: 'dashboard description'     
    });
};