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
                // console.log('tags',tags); 
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



pool.getConnection(async (err, conn)=> {

    // let album_id = null;
    // let singer_id = null;

    //处理歌手
    function dosinger(i,album_id){
        //处理歌手
        let selectsinger = `select * from singer WHERE name = '${fileNames[i].artist||'undefined'}' `;//查询singer表中的歌手
        conn.query(selectsinger, async(err, result)=>{
            if (err) throw err;
            if(result.length==0){
                // 新增歌手
                const addsql = "insert into singer values(null,?,null,null,null,null)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[fileNames[i].artist||'undefined'],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    // console.log(`添加歌手-${fileNames[i].artist}-成功`)
                    singer_id = result.insertId;
                    // console.table({'album_id':album_id,'singer_id':singer_id})
                    dosingeralbum(album_id,singer_id);
                    dosong(singer_id,i,album_id);
                })
            }else{
                singer_id = result[0].id;
                // console.log(`歌手${fileNames[i].artist}已经存在`)
                // console.table({'album_id':album_id,'singer_id':singer_id})
                dosingeralbum(album_id,singer_id);
                dosong(singer_id,i,album_id);
            }
        })
    }

    //singer_album
    function dosingeralbum(album_id,singer_id){
        //处理歌手
        let sql = `select * from singer_album WHERE album_id = '${album_id}' AND singer_id = '${singer_id}' `;
        // let sql = 'SELECT * FROM `singer_album` WHERE `album_id` = album_id AND `singer_id` = singer_id';
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            if(result.length==0){
                // console.log('dosingeralbum album_id',album_id);
                // console.log('dosingeralbum singer_id',singer_id);
                const addsql = "insert into singer_album values(null,?,?)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[album_id,singer_id],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    // console.log(`添加成功`)
                    // console.log('result',result);
                })
            }else{
                // console.log('已经存在',result);
            }
        })
    }

    //处理歌曲
    function dosong(singer_id,i,album_id){
        let selectsong = `select * from song WHERE title = '${fileNames[i].title||'undefined'}' AND album_id = '${album_id}' `;//查询singer表中的歌手
        conn.query(selectsong, async(err, result)=>{
            if (err) throw err;
            if(result.length==0){
                // 新增歌手
                const addsql = "insert into song values(null,?,?,?,null,null)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[fileNames[i].fPath,album_id||'undefined',fileNames[i].title||'undefined'],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    console.log(`添加歌曲-${fileNames[i].title||'undefined'}-成功`)
                    let song_id = result.insertId;
                    // console.table({'song_id':song_id,'singer_id':singer_id})
                    dosongsinger(song_id,singer_id);
                })
            }else{
                let song_id = result[0].id;
                console.log(`歌手${fileNames[i].artist}已经存在`)
                // console.table({'song_id':song_id,'singer_id':singer_id})
                dosongsinger(song_id,singer_id);
            }
        })
    }

    //song_singer
    function dosongsinger(song_id,singer_id){
        //处理歌手
        let sql = `select * from song_singer WHERE song_id = '${song_id}' AND singer_id = '${singer_id}' `;
        // let sql = 'SELECT * FROM `singer_album` WHERE `album_id` = album_id AND `singer_id` = singer_id';
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            if(result.length==0){
                // console.log('dosongsinger song_id',song_id);
                // console.log('dosongsinger singer_id',singer_id);
                const addsql = "insert into song_singer values(null,?,?)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
                conn.query(addsql,[song_id,singer_id],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                    if(error) throw error;
                    console.log(`添加成功`)
                    // console.log('result',result);
                })
            }else{
                // console.log('已经存在',result);
            }
        })
    }


    //开始处理扫描后的数据
    // console.log('fileNames',fileNames);
    for(let i=0; i<fileNames.length; i++){
        album_id = null;
        singer_id = null;
        let albumsql = `select * from album WHERE album_name = '${fileNames[i].album||'undefined'}' `;//查询album表中的专辑
        const [selectRows, selectFields] = await conn.promise().query(albumsql);
        // console.log('selectRows==',selectRows);
        if(selectRows.length==0){
            const addalbumsql = "insert into album values(null,null,?,null)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
            const [insertRows, insertFields] = await conn.promise().query(addalbumsql,[fileNames[i].album||'undefined']);
            // console.log('insertRows==',insertRows.insertId);
            let album_id = insertRows.insertId;
            dosinger(i,album_id);
        }else{
            // console.log('selectRows==',selectRows[0].id);
            let album_id = selectRows[0].id;
            console.log(`专辑${fileNames[i].album}已经存在`)
            dosinger(i,album_id);
        }
        
    }
    conn.release();//数据查询成功后归还连接
})


    

// //处理专辑
// albumValues = Array.from(new Set(albumValues));
// console.log('albumValues',albumValues );

// // pool.getConnection((err, conn)=> {
// //     // const sql = `select * from album WHERE album_name = '${albumValues[1]}' `;//查询album表中的专辑
// //     const sql = `SELECT COUNT(*),album_name FROM album WHERE album_name IN (${albumValues}) GROUP BY id`;//查询album表中的专辑
// //     conn.query(sql, async(err, result)=>{
// //         if (err) throw err;
// //         // await res.status(200).send(result)
// //         console.log('result',result);
// //         conn.release();//数据查询成功后归还连接
// //     })
// // })
