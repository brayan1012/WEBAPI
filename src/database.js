const mongoose = require ('mongoose')
const mongo_uri = 'mongodb+srv://admin:lnjhinLLdDEJ1OlZ@compraventa.enu95.mongodb.net/compraventa';
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
    .then(db => console.log("DB is connected"))
    .catch(error => console.log(error))