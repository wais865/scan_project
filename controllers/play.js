var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');

const { Customer , DocumentModel } = require('./Models/customerModel');
const { default: mongoose } = require('mongoose');

mongoose.connect("mongodb+srv://Mof:123456qwert@development.ei9qgtp.mongodb.net/?retryWrites=true&w=majority");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', (req, res) => {
  res.render('index', { title: 'DataTable with Express and MongoDB' });
});

// API endpoint to fetch customers data
let totalRecordsCache;
app.get('/api/customers', [
  expressValidator.query('start').isNumeric().toInt(),
  expressValidator.query('length').isNumeric().toInt(),
  // ... Add more validators for other query parameters if necessary
], async (req, res) => {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  let query = {};
  // general search
  let searchValue = req.query.search && req.query.search.value;
  if (searchValue) {
    query.$or = [
        { name: { $regex: searchValue, $options: 'i' } },
        { father_name: { $regex: searchValue, $options: 'i' } },
        // ... Add other fields you want to search by as well
    ];
  }

  // Check if a search value is present for the 'name' column
  if (req.query.columns[0].search.value) {
      query.name = { $regex: req.query.columns[0].search.value, $options: 'i' };
  }

  // Check if a search value is present for the 'father_name' column
  if (req.query.columns[1].search.value) {
      query.father_name = { $regex: req.query.columns[1].search.value, $options: 'i' };
  }

  // ... repeat for other columns

    // Sorting
    const sortQuery = {};
    const sortColumnIndex = req.query.order?.[0]?.column;
    const sortDirection = req.query.order?.[0]?.dir;
    const columns = req.query.columns;


    if (sortColumnIndex && sortDirection && columns) {
        // Get the column name from the DataTables request
        const columnName = columns[sortColumnIndex].data;
        sortQuery[columnName] = sortDirection === 'asc' ? 1 : -1;
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
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
