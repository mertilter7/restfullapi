const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restful_api',  { useCreateIndex: true, useUnifiedTopology: true , useNewUrlParser: true })
.then(() => console.log("veri tabanına bağlanıldı"))
.catch(hata => console.log("db bağlantı hatası"))

