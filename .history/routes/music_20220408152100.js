var express = require('express');
var router = express.Router();

const pool = require("../mysql")

router.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
});

router.get('/', function(req, res, next) {

    pool.getConnection((err, conn)=> {
        const sql = "select * from singer";//查询jd_user表中的用户
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            await res.status(200).send(result)
            console.log('result',result);
            conn.release();//数据查询成功后归还连接
        })
    })

});

router.get('/albumList', function(req, res, next) {

    pool.getConnection((err, conn)=> {
        const sql = "select * from album";//查询jd_user表中的用户
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            await res.send({
                code: 200,
                msg: 'success',
                data:result,
            });
            // console.log('result',result);
            conn.release();//数据查询成功后归还连接
        })
    })

});

router.get('/albumDetails', function(req, res, next) {

    pool.getConnection((err, conn)=> {
        // const sql = `select * from album WHERE id = ${req.query.id} `;//查询jd_user表中的用户
        // const sql = `select a.album_name,c.name,d.fpath,d.title
        //             from album a,singer_album b,singer c,song d,song_singer e
        //             where a.id = b.album_id
        //             and b.singer_id = c.id
        //             and d.id = e.song_id
        //             and e.singer_id = c.id
        //             and a.id=${req.query.id}`;//查询jd_user表中的用户
        let sqla = `select a.album_name,a.album_pic,a.des from album a where a.id=${req.query.id}`;
        let sqlb = `select a.album_name,c.name
        from album a,singer_album b,singer c
        where a.id = b.album_id
        and b.singer_id = c.id
        and a.id=${req.query.id}`;
        let sqlc = `select a.album_name,d.fpath,d.title,d.song_pic
        from album a,song d
        where a.id = d.album_id
        and a.id=${req.query.id}`;
        conn.query(sqla, async(err, result)=>{
            if (err) throw err;
            // console.log('result',result);
            let albumInfo = result[0];
            conn.query(sqlb, async(err, singer)=>{
                if (err) throw err;
                // console.log('singer',singer);
                let singerInfo = singer;
                conn.query(sqlc, async(err, song)=>{
                    if (err) throw err;
                    // console.log('singer',song);
                    let songInfo = song;
                    await res.send({
                        code: 200,
                        msg: 'success',
                        albumInfo:albumInfo,
                        singerInfo:singerInfo,
                        songInfo:songInfo
                    });
                })
            })
            // console.log('result',result);
            conn.release();//数据查询成功后归还连接
        })
    })

});

router.post("/addSinger",(req, res)=>{
    const {name, sex, des} = req.body;//获取用户提交的数据
    if(name){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = "insert into singer values(null,?,?,?,?)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
            conn.query(sql,[name, sex, birthday, des],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                if(error) throw error;
                await res.status(200).send("添加成功")
                conn.release();
            })
        })
    }
})

module.exports = router;
