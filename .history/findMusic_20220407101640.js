const fs = require('fs')
const path = require('path')
const  join = require('path').join
const NodeID3 = require("node-id3")
// const writeFile = require('./writeToMongo.js')
const pool = require("./mysql")

var musicName=[];
function findSync(startPath) {
    // let result=[];   
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) {
            //   musicName.push(fPath);
                // 递归读取文件夹下文件
                finder(fPath)
            };
            // 读取文件名
            function getFileName(data) {
                // console.log('getFileName',data);
                return data
                // return data.substring(6,data.indexOf("."));
            }
            fPath = getFileName(fPath);
            if(stats.isFile()){
            //   console.log('fPath',fPath); 
                let tags = NodeID3.read(fPath)
                let data = {
                    fPath:fPath,
                    album:tags.album,
                    title:tags.title,
                    artist:tags.artist,
                    trackNumber:tags.trackNumber
                };
                // console.log('tags',tags)

                // NodeID3.read(fPath, (err, tags) => {
                //     if (err) {
                //         console.log('err',err)
                //     //   reject();
                //     }
                //     console.log(tags)  // 音频的信息
                //     // resolve(obj);
                // });

              musicName.push(data);              
            } 
        });

    }
    finder(startPath);
    return musicName;
}
let fileNames = findSync('./musics');
// console.log('fileNames',fileNames);
let albumValues = [];
let singerValues = [];
let singerAlbumValues = [];
let songValues = [];
let songSingerValues = [];

for(var i=0; i<fileNames.length; i++){
    console.log('fileNames[i]',fileNames[i]);
    albumValues.push(fileNames[i].album||'undefined')
    singerValues.push(fileNames[i].artist||'undefined')
    songValues.push(fileNames[i].title||'undefined')
    // console.log(musicName[i].name);
    // writeFile(musicName[i].name)
}

//处理专辑
albumValues = Array.from(new Set(albumValues));
console.log('albumValues',albumValues );

// pool.getConnection((err, conn)=> {
//     // const sql = `select * from album WHERE album_name = '${albumValues[1]}' `;//查询album表中的专辑
//     const sql = `SELECT COUNT(*),album_name FROM album WHERE album_name IN (${albumValues}) GROUP BY id`;//查询album表中的专辑
//     conn.query(sql, async(err, result)=>{
//         if (err) throw err;
//         // await res.status(200).send(result)
//         console.log('result',result);
//         conn.release();//数据查询成功后归还连接
//     })
// })

pool.getConnection((err, conn)=> {
    for (let index = 0; index < albumValues.length; index++) {
        let sql = `select * from album WHERE album_name = '${albumValues[index]}' `;//查询album表中的专辑
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            console.log('result',result);
            if(result.length==0){
                // 新增专辑
                const addsql = "insert into album values(null,null,?,null)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[albumValues[index]],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    console.log(`添加${albumValues[index]}成功`)
                })
            }else{
                console.log(`专辑${albumValues[index]}已经存在`)
            }
        })
    }
    conn.release();//数据查询成功后归还连接
})

//处理歌手
singerValues = Array.from(new Set(singerValues));
console.log('singerValues',singerValues );
pool.getConnection((err, conn)=> {
    for (let index = 0; index < singerValues.length; index++) {
        let sql = `select * from album WHERE album_name = '${singerValues[index]}' `;//查询album表中的专辑
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            console.log('result',result);
            if(result.length==0){
                // 新增歌手
                const addsql = "insert into album values(null,null,?,null)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[singerValues[index]],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    console.log(`添加${singerValues[index]}成功`)
                })
            }else{
                console.log(`专辑${singerValues[index]}已经存在`)
            }
        })
    }
    conn.release();//数据查询成功后归还连接
})