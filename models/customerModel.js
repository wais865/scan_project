const mongoose = require('mongoose');

// Define the Document schema
const documentSchema = new mongoose.Schema({
    doc_path: String,
    doc_type: String,
    command_number: String,
    command_date: String
});

// Define the Customer schema with a reference to the Document schema
const customerSchema = new mongoose.Schema({
    directorate: String,
    management: String,
    purpose: String,
    degree: String,
    name: String,
    father_name: String,
    document: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocumentModel'
    }
});

const DocumentModel = mongoose.model('DocumentModel', documentSchema);
const Customer = mongoose.model('Customer', customerSchema);

 module.exports = {DocumentModel,Customer};