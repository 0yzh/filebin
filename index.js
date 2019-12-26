require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// multer middleware
const upload = multer({
  dest: path.join(__dirname, './public/images')
  // for later: to set some limits: https://github.com/expressjs/multer#limits
});

// error handling
const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
};

// put image files in a directory named "public/images"
app.get('/', async (req, res) => {
  const fp = path.join(__dirname, `./public/images/`);
  // check for directory contents and pass contents as data to template( index.ejs )
  fs.readdir(fp, function(err, contents) {
    // unexpected error handler
    if (err) return handleError(err, res);
    console.log(contents);
    res.render('index', { data: contents });
  });
});

app.get('/api/images/:image', (req, res) => {
  // do something more useful here later on redirect

  // render the image
  res.sendFile(path.join(__dirname, `./public/images/${req.params.image}`));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log(req.file.path);
    const filePath = req.file.path;
    const storagePath = path.join(
      __dirname,
      `./public/images/${req.file.originalname}`
    );
    // only these files are supported
    if (
      path.extname(req.file.originalname).toLowerCase() === '.png' ||
      path.extname(req.file.originalname).toLowerCase() === '.jpg' ||
      path.extname(req.file.originalname).toLowerCase() === '.gif' ||
      path.extname(req.file.originalname).toLowerCase() === '.svg'
    ) {
      fs.rename(filePath, storagePath, err => {
        // unexpected error handler
        if (err) return handleError(err, res);

        console.log('File uploaded!');
        res.redirect(`/api/images/${req.file.originalname}`);
      });
    } else {
      fs.unlink(filePath, err => {
        // unexpected error handler
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType('text/plain')
          .end(
            'Please check file format. Only [.png, .jpg, .gif, .svg] files are allowed!'
          );
      });
    }
  } else {
    res
      .status(403)
      .contentType('text/plain')
      .end('Please select a file!');
  }
});

app.get('/delete/:image', async (req, res) => {
  console.log(req.params.image);
  const fp = path.join(__dirname, `./public/images/${req.params.image}`);
  await fs.unlink(fp, err => {
    // unexpected error handler
    if (err) return handleError(err, res);
    console.log(`${req.params.image} was removed from the server.`);
  });
  res.redirect('/');
});

app.get('/test', (req, res) => {
  res.send('TEST route');
});

app.listen(app.get('port'), function() {
  console.log(`Node app is running at localhost: ${app.get('port')}`);
});
