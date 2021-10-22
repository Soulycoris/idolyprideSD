<template>
  <div class="container">
    <el-form :model="form" size="mini" class="form" label-width="50px">
      <el-form-item label="骨骼:">
        <el-select v-model="form.skeleton.value" placeholder="骨骼" filterable @change="eventChange($event, 'skeleton')">
          <el-option :label="item" :value="item" v-for="(item, index) in skeletonList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="材质:">
        <el-select v-model="form.skin.value" placeholder="材质" filterable @change="eventChange($event, 'skin')">
          <el-option :label="item" :value="item" v-for="(item, index) in skinList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="动画:">
        <el-select v-model="form.animation.value" placeholder="动画" @change="eventChange($event, 'animation')">
          <el-option :label="item.name" :value="item.name" v-for="(item, index) in animationList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="皮肤:">
        <el-checkbox-group class="skins-group" v-model="form.skins.value" @change="eventChange($event, 'skins')">
          <el-checkbox :label="item.name" v-for="(item, index) in skinsList" :key="index" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" circle @click="eventBuildGif"></el-button>
        <el-progress style="margin-top:6px" v-show="percentage > 0 && percentage < 100" :percentage="percentage" :show-text="false" />
      </el-form-item>
    </el-form>
    <canvas id="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';

import { skeletonList, skinList } from './assets/spine/name';
import spine from './assets/spine/spine-webgl';
import GIF from 'gif.js';

interface Form {
  skeleton: Ref<string>;
  animation: Ref<string>;
  skins: Ref<string[]>;
  skin: Ref<string>;
}
interface skeletonData {
  skeleton: spine.Skeleton;
  state: spine.AnimationState;
  bounds: {
    offset: spine.Vector2;
    size: spine.Vector2;
  };
  premultipliedAlpha: boolean;
}
interface Skeletons {
  [skeletonName: string]: skeletonData;
}

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext | null;
let shader: spine.webgl.Shader;
let batcher: spine.webgl.PolygonBatcher;
let mvp = new spine.webgl.Matrix4();

let skeletonRenderer: spine.webgl.SkeletonRenderer;
let assetManager: spine.webgl.AssetManager;

// let debugRenderer;

let lastFrameTime = 0;
let skeletons: Skeletons = {};
let skinAll = new spine.Skin('body');
let defaultSkeleton = 'spi_sd_chr_cos_mei-idol-01';
let form: Form = {
  skeleton: ref('spi_sd_chr_cos_mei-idol-01'),
  animation: ref('loop_idle'),
  skin: ref('spi_sd_chr_cos_mei-idol-01'),
  skins: ref(['body_FL', 'head_FL', 'shadow']),
};

let gif: GIF;
let buildGifTag = false;

let skeletonsList: Ref<string[]> = ref([]);
let animationList: Ref<spine.Animation[]> = ref([]);
let skinsList: Ref<spine.Skin[]> = ref([]);
let percentage = ref(0);

onMounted(() => {
  init();
});

function init() {
  // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
  // loading textures. That is handled separately by PolygonBatcher.
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  let config = { alpha: false, preserveDrawingBuffer: true };
  gl = (canvas.getContext('webgl', config) as WebGLRenderingContext) || (canvas.getContext('experimental-webgl', config) as WebGLRenderingContext);
  if (!gl) {
    alert('WebGL is unavailable.');
    return;
  }

  // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
  shader = spine.webgl.Shader.newTwoColoredTextured(gl);
  batcher = new spine.webgl.PolygonBatcher(gl);
  mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);

  let context = new spine.webgl.ManagedWebGLRenderingContext(gl);
  skeletonRenderer = new spine.webgl.SkeletonRenderer(context);
  assetManager = new spine.webgl.AssetManager(gl);

  // 初始化gif构建
  initEncoder();

  // Tell AssetManager to load the resources for each skeleton, including the exported .skel file, the .atlas file and the .png
  // file for the atlas. We then wait until all resources are loaded in the load() method.

  // assetNameList.forEach((name) => {
  //   assetManager.loadText(`spine/${name}.skl.skl`);
  //   assetManager.loadTextureAtlas(`spine/${name}.atlas.atlas`);
  // });
  // assetManager.loadText(`spine/spi_sd_chr_mot_cmn.skl.skl`);
  // assetManager.loadTextureAtlas(`spine/${form.skeleton.value}.atlas.atlas`);

  loadAssets();
}

function initEncoder() {
  gif = new GIF({
    background: '#00',
    quality: 10,
    height: canvas.clientHeight,
    width: canvas.clientWidth,
    workers: 4,
    workerScript: '/assets/gif/gif.worker.js',
    repeat: 0,
  });

  gif.on('finished', (blob) => {
    console.log('finished');
    const dom = document.createElement('a');
    dom.href = URL.createObjectURL(blob);
    dom.download = form.skeleton.value;
    dom.click();
    URL.revokeObjectURL(dom.href);
    gif.abort();
  });

  gif.on('start', () => {
    console.log('start');
  });

  gif.on('progress', (num: number) => {
    console.log(num);
    if (!num) {
      return;
    }
    percentage.value = Math.floor(num * 100);
  });
}

function eventBuildGif() {
  if (percentage.value > 0 && percentage.value < 100) {
    return;
  }
  buildGifTag = true;
  let state = skeletons[form.skeleton.value].state;
  let skeleton = skeletons[form.skeleton.value].skeleton;
  skeleton.setToSetupPose();
  state.setAnimation(0, form.animation.value, false);
}

function handleBuildGif() {
  if (!buildGifTag) {
    return;
  }
  if (gl) {
    gif.addFrame(canvas, { copy: true, delay: 1000 / 60 });
  }
}

function loadAssets() {
  if (!assetManager.get(`spine/${form.skeleton.value}.skl.skl`)) {
    assetManager.loadText(`spine/${form.skeleton.value}.skl.skl`);
  }
  if (!assetManager.get(`spine/${form.skin.value}.atlas.atlas`)) {
    assetManager.loadTextureAtlas(`spine/${form.skin.value}.atlas.atlas`);
  }
  requestAnimationFrame(load);
}

function load() {
  // Wait until the AssetManager has loaded all resources, then load the skeletons.
  if (assetManager.isLoadingComplete()) {
    skeletons[form.skeleton.value] = loadSkeleton(form.skeleton.value, form.skin.value);
    setupUI();
    lastFrameTime = Date.now() / 1000;
    requestAnimationFrame(render); // Loading is done, call render every frame.
  } else {
    requestAnimationFrame(load);
  }
}

function loadSkeleton(skeleName: string, atlasName: string): skeletonData {
  // Load the texture atlas using name.atlas from the AssetManager.

  // let atlas = assetManager.get('spine/spi_sd_chr_cos_mei-idol-01.atlas.atlas') as spine.TextureAtlas;
  let atlas = assetManager.get('spine/' + atlasName + '.atlas.atlas') as spine.TextureAtlas;

  // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
  let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

  // Create a skeleton loader instance for parsing the skeleton data file.
  let skeletonLoader = new spine.SkeletonJson(atlasLoader);

  // Set the scale to apply during parsing, parse the file, and create a new skeleton.
  skeletonLoader.scale = 1;
  let skeletonData = skeletonLoader.readSkeletonData(assetManager.get('spine/' + skeleName + '.skl.skl'));
  let skeleton = new spine.Skeleton(skeletonData);

  if (skeletonData.skins[5]) {
    skinAll.addSkin(skeletonData.skins[1]);
    skinAll.addSkin(skeletonData.skins[3]);
    skinAll.addSkin(skeletonData.skins[5]);
    skeleton.setSkin(skinAll);
  } else {
    skeleton.setSkinByName('default');
  }

  let bounds = calculateSetupPoseBounds(skeleton);

  // Create an AnimationState, and set the initial animation in looping mode.
  let animationStateData = new spine.AnimationStateData(skeleton.data);
  let animationState = new spine.AnimationState(animationStateData);
  let animations = skeletonData.animations[1]?.name ?? skeletonData.animations[0].name;
  animationState.setAnimation(0, animations, true);
  form.animation.value = animations;

  animationState.addListener({
    start: (entry) => {
      if (buildGifTag) {
        percentage.value = 0.1;
        console.log('animation start');
      }
    },
    interrupt: (entry) => {},
    end: (entry) => {},
    dispose: (entry) => {},
    complete: (entry) => {
      if (buildGifTag) {
        console.log('animation complete');
        buildGifTag = false;
        gif.render();
      }
    },
    event: (entry, event) => {},
  });

  // Pack everything up and return to caller.
  return { skeleton, state: animationState, bounds, premultipliedAlpha: false };
}

function calculateSetupPoseBounds(skeleton: spine.Skeleton) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();
  let offset = new spine.Vector2();
  let size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);
  return { offset: offset, size: size };
}

function eventChange(val: string | string[], tag: string) {
  // console.log(val, tag);
  let skeleton = skeletons[form.skeleton.value]?.skeleton;
  let state = skeletons[form.skeleton.value]?.state;

  if (tag === 'animation') {
    skeleton.setToSetupPose();
    state.setAnimation(0, val as string, true);
  } else if (tag === 'skins') {
    skinAll.clear();
    skinsList.value.forEach((e) => {
      if (val.includes(e.name)) skinAll.addSkin(e);
    });
    skeleton.setSkin(skinAll);
    skeleton.setSlotsToSetupPose();
    loadAssets();
  } else if (tag === 'skin') {
    skeleton.setSlotsToSetupPose();
    loadAssets();
  } else if (tag === 'skeleton') {
    form.animation.value = '';
    form.skeleton.value = val as string;
    form.skin.value = skinList.includes(val as string) ? (val as string) : defaultSkeleton;
    if (!skeleton) {
      loadAssets();
    } else {
      setupUI();
    }
  }
}

function setupUI() {
  if (!skeletonsList.value.length) {
    skeletonsList.value = Object.keys(skeletons);
  }
  let skeleton = skeletons[form.skeleton.value].skeleton;
  animationList.value.splice(0, animationList.value.length, ...skeleton.data.animations);
  skinsList.value.splice(0, skinsList.value.length, ...skeleton.data.skins);
}

function render() {
  if (!skeletons[form.skeleton.value]) {
    return;
  }

  let now = Date.now() / 1000;
  let delta = now - lastFrameTime;
  lastFrameTime = now;
  // Update the MVP matrix to adjust for canvas size changes
  resize();

  // gl?.clearColor(0, 0, 0, 0)
  gl?.clearColor(0.3, 0.3, 0.3, 1);
  gl?.clear(gl.COLOR_BUFFER_BIT);

  // Apply the animation state based on the delta time.
  let skeleton = skeletons[form.skeleton.value].skeleton;
  let state = skeletons[form.skeleton.value].state;

  let premultipliedAlpha = skeletons[form.skeleton.value].premultipliedAlpha;

  state.update(delta);
  state.apply(skeleton);

  skeleton.updateWorldTransform();

  // Bind the shader and set the texture and model-view-projection matrix.
  shader.bind();
  shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
  shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);
  // Start the batch and tell the SkeletonRenderer to render the active skeleton.
  batcher.begin(shader);

  skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
  skeletonRenderer.draw(batcher, skeleton);

  batcher.end();
  shader.unbind();

  if (buildGifTag) {
    handleBuildGif();
  }
  requestAnimationFrame(render);
}

function resize() {
  let w = canvas.clientWidth;
  let h = canvas.clientHeight;
  if (canvas.width != w || canvas.height != h) {
    canvas.width = w;
    canvas.height = h;
  }

  // Calculations to center the skeleton in the canvas.
  let bounds = skeletons[form.skeleton.value].bounds;
  let centerX = bounds.offset.x + bounds.size.x / 2;
  let centerY = bounds.offset.y + bounds.size.y / 2;
  let scaleX = bounds.size.x / canvas.width;
  let scaleY = bounds.size.y / canvas.height;
  let scale = Math.max(scaleX, scaleY) * 1.2;
  if (scale < 1) scale = 1;
  let width = canvas.width * scale;
  let height = canvas.height * scale;

  mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
  gl?.viewport(0, 0, canvas.width, canvas.height);
}
</script>
<style lang="scss" scope>
body,
html {
  margin: 0;
  padding: 0;
}
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.form {
  flex: none;
  padding: 16px;
  .skins-group {
    display: flex;
    flex-direction: column;
  }
}
#canvas {
  flex: 1;
}
</style>
