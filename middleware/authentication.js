const requireauth = (req,res,next) => {
    if(req.session.user && req.session.user.authenticated){
        next();
    }else{res.redirect('/login.html')}
}
module.exports = {requireauth};