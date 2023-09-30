const expressValidator  = require('express-validator');
const {DocumentModel , Customer} = require('../models/customerModel');
const sharp = require('sharp');
const shortId = require('shortid');
const moment = require('moment');


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

exports.documentFiles = (req, res, next) =>{
    res.render('customers', 
    {   
        title: 'document page',
        description: 'document description'     
    });
};

exports.createNewDoc = async (req, res, next) => {
    try{ //? function is created for creating auto increment field in database
        function getNextSequenceValue(sequenceName){
            var sequenceDocument = db.DocumentModel.findAndModify({
               query:{_id: sequenceName },
               update: {$inc:{sequence_value:1}},
               new:true
            });
            return sequenceDocument.sequence_value;
         }

        const storeData = async (req) => {
            //?---------uploading photo-----------------------------------------
            let photo = req.files ? req.files.doc : {};
            req.body = {...photo,...req.body,...{uniqueId:getNextSequenceValue("productid")}};
            const photoName = `${shortId.generate()}_${photo.name}`;
            const UploadPath = `./uploads/${photoName}`;
            //?--------End uploading photo-----------------------------------------
            //?---------Decrease the size of photo-----------------------------------------
            await sharp(photo.data).jpeg({ quality: 50 }).toFile(UploadPath).catch((err) => {
                console.log(err);
            })
            //?---------End Decrease the size of photo--------------------------------------
            // First, save the document
 
            const docData = {
                path: UploadPath,
                doc_type: req.body.doc_type,
                command_number: req.body.command_number,
                command_date: moment(new Date(req.body.command_date)).format('MM-DD-YYYY')
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
};


/* GET /api/customers search using ajax. */
// search Methods usnig ajax request
// paginations and return search results
let totalRecordsCache;
exports.searchFunc = async (req, res) => {
    /* error handling */
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    /* end error handling */
    
    let query = {};
    // general search
    let searchValue = req.query.search && req.query.search.value;
    if (searchValue) {
      query.$or = [
          { name: { $regex: searchValue, $options: 'i' } },
          { father_name: { $regex: searchValue, $options: 'i' } },
          { degree: { $regex: searchValue, $options: 'i' } },
          { management: { $regex: searchValue, $options: 'i' } },
          { document:{command_number: { $regex: searchValue, $options: 'i' } }},
          { document:{command_date: { $regex: searchValue, $options: 'i' } }},
          { purpose: { $regex: searchValue, $options: 'i' } },
          // ... Add other fields you want to search by as well
      ];
    }
    

    const columnMap = {
        0: 'name',
        1: 'father_name',
        2: 'degree',
        3: 'management',
        // 4 will be handled separately due to the reference
        6: 'purpose'
    };
    
    for (let columnIndex in columnMap) {
        const searchValue = req.query.columns[columnIndex].search.value;
        if (searchValue) {
            query[columnMap[columnIndex]] = { $regex: searchValue, $options: 'i' };
        }
    }
    
    // Handle document.command_date separately
    // Handle document.command_number separately
    let docQuery = {};
    const documentColumnMap = {
        4: 'command_date',
        5: 'command_number'
    };
    
    for (let columnIndex in documentColumnMap) {
        const searchValue = req.query.columns[columnIndex].search.value;
        if (searchValue) {
            docQuery[documentColumnMap[columnIndex]] = { $regex: searchValue, $options: 'i' };
        }
    }
    
    if (Object.keys(docQuery).length > 0) {
        try {
            const matchingDocuments = await DocumentModel.find(docQuery);
            const matchingDocumentIds = matchingDocuments.map(doc => doc._id);
            query.document = { $in: matchingDocumentIds };
        } catch (err) {
            console.error("Error querying DocumentModel", err);
            return res.status(500).json({ error: 'Database error querying documents' });
        }
    }
    
    
    
    // Sorting
    let sortQuery = {};
    const sortColumnIndex = req.query.order?.[0]?.column;
    const sortDirection = req.query.order?.[0]?.dir;
    const columns = req.query.columns;
    
    
    if (sortColumnIndex && sortDirection && columns) {
        // Get the column name from the DataTables request
        const columnName = columns[sortColumnIndex].data;
        sortQuery[columnName] = sortDirection === 'asc' ? 1 : -1;
    }else{
        sortQuery = { _id : -1};
    }
    
    // Pagination
    const start = parseInt(req.query.start || 0);
    const length = parseInt(req.query.length || 10); // Default to 10 if length is not specified
    
    let customers;
    let recordsFiltered;
    try {
        customers = await Customer.find(query)
        .sort(sortQuery)
        .skip(start)
        .limit(length)
        .populate('document')
        .exec();
        
        recordsFiltered = await Customer.find(query).countDocuments();
    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
    
    const recordsTotal = totalRecordsCache || await Customer.countDocuments();
    if (!totalRecordsCache) totalRecordsCache = recordsTotal;
    

    res.json({
        draw: req.query.draw,
        recordsTotal,
        recordsFiltered,
        data: customers
    });
    
        
    
};

