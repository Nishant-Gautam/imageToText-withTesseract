const express = require('express');
const multer = require('multer');
const path = require('path');
const tesseract = require("node-tesseract-ocr");

const app = express();

app.set('views', path.join(__dirname , '/views'));
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname + '/uploads')));



const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})

const upload  = multer({storage: fileStorageEngine});



app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.get('/single', (req, res) => {
    res.render('single', {data: ""})
})

app.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file.path);
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    };
     
    tesseract
    .recognize(req.file.path, config)
    .then((text) => {
    // console.log("Result at console:", text) 
    res.render('single', {data: text});
    })
    .catch((error) => {
    console.log(error.message)
    }); 
})

app.post('/multiple', upload.array('images'), (req, res) => {
    console.log(req.files);
    res.send("Multiple files uploaded successfully.")
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
});