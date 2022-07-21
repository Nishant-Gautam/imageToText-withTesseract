const express = require('express');
const multer = require('multer');
const path = require('path');
const tesseract = require("node-tesseract-ocr")

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

tesseract
.recognize("image.jpg", config)
.then((text) => {
console.log("Result:", text)
})
.catch((error) => {
console.log(error.message)
})

const app = express();

app.set('views', path.join(__dirname , '/views'));
app.set('view engine', 'ejs');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./images");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})

const upload  = multer({storage: fileStorageEngine});


app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send("Single file uploaded successfully.")
})

app.post('/multiple', upload.array('images'), (req, res) => {
    console.log(req)
    console.log(req.files);
    res.send("Multiple files uploaded successfully.")
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
});