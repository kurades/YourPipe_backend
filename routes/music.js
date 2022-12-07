var express = require('express');
var cookieParser = require('cookie-parser')
var { getInfo, addMusicQueue, getMusicList, getMusicQueue, deleteMusicQueue } = require('../controller/music.controller')
var verifiToken = require('../middleware/verifyToken')
var router = express.Router();


router.get('/info', async (req, res) => {
    const { videoId } = req.query;
    const result = await getInfo(videoId);
    if (result.type === 'success') {
        return res.status(result.status).json(result.data)
    }
    return res.status(result.status).send(result.data)
})

router.put('/queue', verifiToken, async (req, res) => {
    let { videoId } = req.query;
    let { userId } = req.query;
    const result = await addMusicQueue(userId, videoId)
    if (result.type === 'success') {
        return res.status(result.status).json(result.data)
    }
    return res.status(result.status).send(result.data)
})
router.delete('/queue',verifiToken, async(req,res)=>{
    let { videoId } = req.query
    let { userId } = req.query
    const result = await deleteMusicQueue(userId, videoId)
    return res.status(result.status).send(result.data)
})
router.get('/queue', verifiToken, async (req, res) => {
    let {_id} = req.user;
    console.log(_id);
    let result = await getMusicQueue(_id)
    return res.status(200).json(result)
})


module.exports = router;
