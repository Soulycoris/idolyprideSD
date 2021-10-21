<template>
  <div class="container">
    <el-form :model="form" size="mini" class="form" label-width="50px">
      <el-form-item label="骨骼:">
        <el-select v-model="form.skeleton.value" placeholder="骨骼" filterable @change="eventChange($event, 'skeleton')">
          <el-option :label="item" :value="item" v-for="(item, index) in assetNameList" :key="index"></el-option>
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
    </el-form>
    <canvas id="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, reactive, toRefs, onMounted, computed, ref, Ref } from 'vue';
import assetNameList from './assets/spine/name.js';
import spine from './assets/spine/spine-webgl';
// console.log(assetNameList);

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
let activeSkeleton = 'spi_sd_chr_cos_mei-idol-01';

let skinAll = new spine.Skin('body');

let form: Form = {
  skeleton: ref('spi_sd_chr_cos_mei-idol-01'),
  animation: ref('loop_idle'),
  skin: ref('body_FL'),
  skins: ref(['body_FL', 'head_FL', 'shadow']),
};

onMounted(() => {
  init();
});

let skeletonsList: Ref<string[]> = ref([]);
let animationList: Ref<spine.Animation[]> = ref([]);
let skinsList: Ref<spine.Skin[]> = ref([]);

function init() {
  // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
  // loading textures. That is handled separately by PolygonBatcher.
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  let config = { alpha: false };
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

  // Create a debug renderer and the ShapeRenderer it needs to render lines.
  // debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
  // debugRenderer.drawRegionAttachments = true;
  // debugRenderer.drawBoundingBoxes = true;
  // debugRenderer.drawMeshHull = true;
  // debugRenderer.drawMeshTriangles = true;
  // debugRenderer.drawPaths = true;

  // Tell AssetManager to load the resources for each skeleton, including the exported .skel file, the .atlas file and the .png
  // file for the atlas. We then wait until all resources are loaded in the load() method.

  // assetNameList.forEach((name) => {
  //   assetManager.loadText(`spine/${name}.skl.skl`);
  //   assetManager.loadTextureAtlas(`spine/${name}.atlas.atlas`);
  // });
  // assetManager.loadText(`spine/spi_sd_chr_mot_cmn.skl.skl`);
  // assetManager.loadTextureAtlas(`spine/${activeSkeleton}.atlas.atlas`);

  loadAssets(activeSkeleton);
}
function loadAssets(asstesName: string) {
  assetManager.loadText(`spine/${asstesName}.skl.skl`);
  assetManager.loadTextureAtlas(`spine/${asstesName}.atlas.atlas`);
  // activeSkeleton = 'spi_sd_chr_mot_cmn';
  requestAnimationFrame(load);
}

function load() {
  // Wait until the AssetManager has loaded all resources, then load the skeletons.
  if (assetManager.isLoadingComplete()) {
    skeletons[activeSkeleton] = loadSkeleton(activeSkeleton);
    setupUI();
    lastFrameTime = Date.now() / 1000;
    requestAnimationFrame(render); // Loading is done, call render every frame.
  } else {
    requestAnimationFrame(load);
  }
}

function loadSkeleton(name: string): skeletonData {
  // Load the texture atlas using name.atlas from the AssetManager.

  // let atlas = assetManager.get('spine/spi_sd_chr_cos_mei-idol-01.atlas.atlas') as spine.TextureAtlas;
  let atlas = assetManager.get('spine/' + name + '.atlas.atlas') as spine.TextureAtlas;
  console.log(atlas);

  // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
  let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

  // Create a skeleton loader instance for parsing the skeleton data file.
  let skeletonLoader = new spine.SkeletonJson(atlasLoader);

  // Set the scale to apply during parsing, parse the file, and create a new skeleton.
  skeletonLoader.scale = 1;
  let skeletonData = skeletonLoader.readSkeletonData(assetManager.get('spine/' + name + '.skl.skl'));
  let skeleton = new spine.Skeleton(skeletonData);
  console.log(skeletonData);

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

  // animationState.addListener({
  //   start: (entry) => {},
  //   interrupt: (entry) => {},
  //   end: (entry) => {},
  //   dispose: (entry) => {},
  //   complete: (entry) => {},
  //   event: (entry, event) => {},
  // });

  // Pack everything up and return to caller.
  return { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: false };
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
  let skeleton = skeletons[activeSkeleton].skeleton;
  let state = skeletons[activeSkeleton].state;

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
  } else if (tag === 'skeleton') {
    form.animation.value = '';
    form.skin.value = '';
    activeSkeleton = val as string;
    let res = assetManager.get('spine/' + activeSkeleton + '.skl.skl');
    if (!res) {
      loadAssets(activeSkeleton);
    } else {
      setupUI();
    }
  }
}

function setupUI() {
  if (!skeletonsList.value.length) {
    skeletonsList.value = Object.keys(skeletons);
  }
  let skeleton = skeletons[activeSkeleton].skeleton;
  animationList.value.splice(0, animationList.value.length, ...skeleton.data.animations);
  skinsList.value.splice(0, skinsList.value.length, ...skeleton.data.skins);
}
function render() {
  if (!skeletons[activeSkeleton]) {
    return;
  }
  let now = Date.now() / 1000;
  let delta = now - lastFrameTime;
  lastFrameTime = now;
  // Update the MVP matrix to adjust for canvas size changes
  resize();

  if (gl) {
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  // Apply the animation state based on the delta time.
  let skeleton = skeletons[activeSkeleton].skeleton;
  let state = skeletons[activeSkeleton].state;

  let premultipliedAlpha = skeletons[activeSkeleton].premultipliedAlpha;

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
  let bounds = skeletons[activeSkeleton].bounds;
  let centerX = bounds.offset.x + bounds.size.x / 2;
  let centerY = bounds.offset.y + bounds.size.y / 2;
  let scaleX = bounds.size.x / canvas.width;
  let scaleY = bounds.size.y / canvas.height;
  let scale = Math.max(scaleX, scaleY) * 1.2;
  if (scale < 1) scale = 1;
  let width = canvas.width * scale;
  let height = canvas.height * scale;

  mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
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
