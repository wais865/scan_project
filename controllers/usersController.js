const usersCollection = require('../models/usersModel');


exports.usersPage = (req , res , next)=>{   
    // usersCollection.create({
    //     name:"zamir",
    //     lastName:"haidari",
    //     fatherName:"nasir",
    //     occupation:"NTA",
    //     accessLevel:2,
    // });
    res.render('index',{
        title: "users page",
        description:"users page is ready"
    })
};

