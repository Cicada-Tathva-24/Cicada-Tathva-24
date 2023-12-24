const mongoose=require('mongoose');

module.exports=()=>{
mongoose.connect('mongodb://127.0.0.1:27017/log_detail');
mongoose.connection.once('open',()=>{
    console.log('Connected');
}).on('error',(err)=>console.log(err));
}