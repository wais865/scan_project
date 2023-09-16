

/* GET /index home page. */
exports.indexFiles = (req, res, next) =>{
    res.render('index', 
    {   
        title: 'اصلی',
        description: 'index description'     
    });
};

/* GET /dashboard dashboard page. */
exports.dashboardFiles = (req, res, next) =>{
    res.render('dashboard', 
    {   
        title: 'dashboard page',
        description: 'dashboard description'     
    });
};

exports.createNewDoc = (req, res, next) =>{
    console.log(req.files);
    res.send(req.body);
}