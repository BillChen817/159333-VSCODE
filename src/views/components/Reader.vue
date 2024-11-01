<template>
    <el-dialog :visible="visible" width="100%" @close="handleClose" :close-on-click-modal="false">
        <div v-if="mediaType != null && mediaType == '1'" class="iframe-container">
            <!-- 使用iframe -->
            <iframe :src="baseApi + '/file/' + mediaUrl" class="full-height-iframe"></iframe>
        </div>
        <div v-if="mediaType != null && mediaType == '2'" class="audio-container">
            <audio ref="audioPlayer" @ended="onEnded" :src="baseApi + '/file/' + mediaUrl" controls></audio>
            <div class="audio-controls">
                <el-button type="primary" @click="playAudio">Play</el-button>
                <el-button type="info" @click="pauseAudio">Pause</el-button>
            </div>
        </div>
        <div v-if="mediaType != null && mediaType == '3'" class="video-container">
            <video ref="videoPlayer" :src="baseApi + '/file/' + mediaUrl" @ended="onVideoEnded"
                controls>
                Your browser does not support the video tag.
            </video>
        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Reader',
    props: {
        mediaType: {
            type: String,
            default: '1'
        },
        mediaUrl: String
    },
    computed: {
        ...mapGetters([
            'user',
            'baseApi'
        ])
    },
    created() {
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        handleClose() {
            this.visible = false
            if (this.$refs.videoPlayer) {
                this.$refs.videoPlayer.pause();
            }
            if (this.$refs.audioPlayer) {
                this.$refs.audioPlayer.pause();
            }
        },
        handleOpen() {
            this.visible = true
        },
        playAudio() {
            this.$refs.audioPlayer.play();
        },
        pauseAudio() {
            this.$refs.audioPlayer.pause();
        },
        onEnded() {
            console.log('音频播放完毕');
        },
        // 使用ref属性来引用video元素，并调用其方法  
        playVideo() {
            this.$refs.videoPlayer.play();
        },
        pauseVideo() {
            this.$refs.videoPlayer.pause();
        },
        // 视频结束时的回调函数  
        onVideoEnded() {
            console.log('视频播放完毕');
        },
    }
};  
</script>

<style>
.el-dialog {
    margin-top: 0px !important;
}

.audio-controls {
    height: 50px;
    line-height: 50px;
}

.audio-container {
    /* 假设你的页面顶部有一个导航栏，高度为60px */
    height: calc(100vh - 90px);
    /* 100vh 是视窗高度的100% */
    overflow: hidden;
    /* 防止iframe内容溢出 */
    position: relative;
    /* 相对于这个容器定位iframe（如果需要的话） */
    text-align: center;
}

.video-container {
    width: 76%;
    left: 12%;
    /* 容器宽度 */
    height: 0;
    /* 初始高度为0，通过padding-top来设置高度 */
    padding-top: 48%;
    /* 高度为宽度的56.25%，即16:9的宽高比 */
    position: relative;
}

.video-container video {
    position: absolute;
    top: 0;
    left: 0%;
    width: 100%;
    height: 100%;
}

.iframe-container {
    /* 假设你的页面顶部有一个导航栏，高度为60px */
    height: calc(100vh - 90px);
    /* 100vh 是视窗高度的100% */
    overflow: hidden;
    /* 防止iframe内容溢出 */
    position: relative;
    /* 相对于这个容器定位iframe（如果需要的话） */
}

.full-height-iframe {
    width: 100%;
    /* 宽度占满容器 */
    height: 100%;
    /* 高度占满容器 */
    border: none;
    /* 移除边框，如果需要的话 */
    display: block;
    /* 移除iframe下方的额外空间 */
}
</style>