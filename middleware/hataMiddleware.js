const hataYakalayici = (err, req, res, next) => {
    
    res.json({
        hataKodu : err.statusCode || 400,
        mesaj : err.message
    })
}
module.exports = hataYakalayici;