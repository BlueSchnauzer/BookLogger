import { MONGO_URL } from "$env/static/private";
import mongoose from "mongoose";

export const connect = async () => {
    try {
        if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected){
            await mongoose.connect(MONGO_URL)
            console.log('DBに接続しました。');
        }
    }
    catch (ex){
        console.log(`接続に失敗しました。エラー：${ex}`);
    }
}