
exports.usersPage = (req , res , next)=>{    
    res.render('index',{
        title: "users page",
        description:"users page is ready"
    })
};