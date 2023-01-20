<template>
    <div>
      <video ref="video" @loadedmetadata="setCanvas"></video>
      <canvas ref="canvas"></canvas>
      <button @click="takeScreenshot">Take Screenshot</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stream: null
      }
    },
    mounted() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          this.stream = stream;
          this.$refs.video.srcObject = stream;
          this.$refs.video.play();
        })
        .catch(err => {
          console.log("An error occurred: " + err);
        });
    },
    methods: {
      setCanvas() {
        this.$refs.canvas.width = this.$refs.video.videoWidth;
        this.$refs.canvas.height = this.$refs.video.videoHeight;
      },
      takeScreenshot() {
      const canvas = this.$refs.canvas;
      const video = this.$refs.video;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL();
      // do something with the imgData, for example create a new image element and append it to the document
      var newImg = new Image();
      newImg.src = imgData;
      document.body.appendChild(newImg);
    }
    }
  }
  </script>