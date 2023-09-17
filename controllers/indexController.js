const {DocumentModel , Customer} = require('../models/customerModel');

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

exports.createNewDoc = async (req, res, next) => {
    try{

        const storeData = async (req) => {
            req.body = {...req.files,...req.body};
            // First, save the document
            const docData = {
                name: req.body.doc.name,
                doc_type: req.body.doc_type,
                command_number: req.body.command_number,
                command_date: new Date(req.body.command_date)
            };
            
            const document = await new DocumentModel(docData).save();
            
            // Extract user data and save it
            const usersData = {};
            const previousUser = {};
            
            for (const key in req.body) {
                if (key.startsWith("users")) {
                    const [, index, field] = key.match(/^users\[(\d+)\]\[(\w+)\]$/);
                    
                    if (!usersData[index]) {
                        usersData[index] = {};
                    }
                    
                    if (req.body[key]) {
                        usersData[index][field] = req.body[key];
                        if (["directorate", "management", "purpose", "degree"].includes(field)) {
                            previousUser[field] = req.body[key];
                        }
                    } else {
                        usersData[index][field] = previousUser[field];
                    }
                }
            }
    
            // Save each user to the Customer collection
            for (const index in usersData) {
                const userData = usersData[index];
                userData.document = document._id; // Set the document reference
                await new Customer(userData).save();
            }
        };
        
        storeData(req);  // Assuming 'req' is your request object
        res.status(200).redirect('back');
    }catch(error) {
        res.status(500).send("error in creating customer");
    }
    // const request = {...req.files,...req.body};
    // console.log(req.body);
    // res.send(request);
    // try {
    //     let previousUser = {};
    //     const usersData = [];
        
    //     for (let key in req.body) {
    //         if (key.startsWith("users")) {
    //             const [, index, field] = key.match(/^users\[(\d+)\]\[(\w+)\]$/);
                
    //             if (!usersData[index]) {
    //                 usersData[index] = {};
    //             }
                
    //             // If the current user has the field, set it and update the previousUser value.
    //             // If not, use the previous user's value.
    //             if (req.body[key]) {
    //                 usersData[index][field] = req.body[key];
    //                 previousUser[field] = req.body[key];
    //             } else {
    //                 usersData[index][field] = previousUser[field];
    //             }
    //         }
    //     }
        
    //     // Now, save all the users to the database
    //     await User.insertMany(usersData);
        
    //     res.send("Users saved successfully!");

    // } catch (error) {
    //     console.error("Error saving users:", error);
    //     res.status(500).send("Server Error");
    // }
};
