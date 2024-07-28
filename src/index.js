import express from 'express'
import bodyParser from 'body-parser';
import {PORT} from '../config/server_config.js'
import userRouter from '../routes/user.route.js';
import authRouter from '../routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/auth',authRouter);


const setup_and_start_server=async ()=>{

    app.listen(PORT,()=>{
        console.log('Server started at Port:',PORT);
    })
}

setup_and_start_server();

