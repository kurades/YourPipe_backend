const { default: mongoose } = require("mongoose");
const yts = require("yt-search");
const ytdl = require('ytdl-core')
const Music = require('../database/musics.model');
const User = require("../database/users.model");

async function getInfo(videoId) {

    console.log(`---GET VIDEO INFO IN ${videoId}---`);

    try {
        const checkExist = await Music.findOne({ videoId })
        if (checkExist) {
            console.log(`---VIDEO IN ${videoId} WAS EXIST---`);
            let checkExpired = (Date.now() - Date.parse(checkExist.updateAt)) / 3600000 > 6;
            console.log((Date.now() - Date.parse(checkExist.updateAt)) / 3600000);
            if (checkExpired) {
                try {
                    const updated = await Music.findOneAndUpdate(
                        { videoId: checkExist.videoId },
                        { updateAt: Date.now(), audioUrl: await getAudio(checkExist.videoId) },
                        { new: true }
                    )
                    console.log('----UPDATED----');
                    return {
                        type: 'success',
                        status: 200,
                        data: updated
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            return {
                type: 'success',
                status: 200,
                data: checkExist,
            }
        }
        const result = await yts({ videoId })
        const music = new Music({
            title: result.title,
            description: result.description,
            url: result.url,
            seconds: result.seconds,
            audioUrl: await getAudio(result.videoId),
            timeStamp: result.timestamp,
            views: result.views,
            videoId: result.videoId,
            ago: result.ago,
            thumbnail: result.thumbnail,
            author: {
                name: result.author.name,
                url: result.author.url,
            }
        })
        try {
            const newMusic = await music.save()
            return {
                type: 'success',
                status: 200,
                data: newMusic,
            }
        } catch (error) {
            return {
                type: 'error',
                status: 400,
                data: error,
            }
        }
    } catch (error) {
        console.log(error);
        return {
            type: 'error',
            status: 404,
            data: error,
        }
    }
}

async function addMusicQueue(userId, videoId) {

    try {
        const music = await getInfo(videoId);
        if (music) {
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { "playlist": videoId } },
                { new: true }
            )
            return {
                type: 'success',
                status: 200,
                data: music.data,
                user: {
                    ...user,
                    playlist: [...user.playlist, music.data.videoId]
                }
            }
        }
    } catch (error) {
        console.log(error);
        return {
            type: 'error',
            status: 400,
            data: error,

        }
    }

}

async function getMusicQueue(id) {
    const user = await User.findById(id)
    console.log(user);
    if (user.playlist === [])
        return {
            type: 'error',
            status: 404,
            data: 'Queue not found',
        }
    playlistChain = user.playlist.map((item) => getInfo(item))
    return await Promise.allSettled(playlistChain)
        .then(values => {
            values = values.map((value) => {
                if (value.status === 'fulfilled')
                    return value.value
                return {
                    status: 500,
                    type: 'error',
                    data: value.value,
                }
            })
            return values
        })
}

async function deleteMusicQueue(userId, videoId) {
    // console.log(videoId);
    try {
        await User.findByIdAndUpdate(userId, {
            $pull: {
                playlist: videoId,
            }
        }, {
            new: true,
        })
        return {
            type: 'success',
            status: 200,
            data: 'Deleted'
        }
    } catch (error) {
        console.log(error);
        return {
            type: 'error',
            status: 500,
            data: 'Got error when delete'
        }
    }

}

async function getAudio(videoId) {
    if (!videoId) res.status(400).send('Id is required')
    try {
        let { formats } = await ytdl.getInfo(videoId)
        let { url: audio } = formats.find(item => item.itag === 251)
        return audio
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getInfo, getAudio, addMusicQueue, getMusicQueue, deleteMusicQueue }