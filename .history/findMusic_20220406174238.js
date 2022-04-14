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
    // console.log(musicName[i].name);
    // writeFile(musicName[i].name)
}

//处理专辑
albumValues = Array.from(new Set(albumValues));
console.log('albumValues',albumValues );

pool.getConnection((err, conn)=> {
    const sql = `select * from album WHERE album_name = '${albumValues[1]}' ` ;//查询album表中的专辑
    conn.query(sql, async(err, result)=>{
        if (err) throw err;
        // await res.status(200).send(result)
        console.log('result',result);
        conn.release();//数据查询成功后归还连接
    })
})