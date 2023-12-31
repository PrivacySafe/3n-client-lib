<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'

  export interface Ui3nDropFilesProps {
    title?: string;
    text?: string;
    additionalText?: string;
  }

  export interface Ui3nDropFilesEmits {
    (e: 'select', fileList: FileList): void;
  }

  const props = defineProps<Ui3nDropFilesProps>()
  const emit = defineEmits<Ui3nDropFilesEmits>()

  const wrapperElement = ref<HTMLDivElement | null>(null)
  const wrapperElementHeight = ref(0)
  const isOverDropPlace = ref(false)
  const isOverDropZone = ref(false)
  const params = computed(() => {
    const {
      title = 'Upload',
    } = props

    return {
      title,
    }
  })

  onMounted(() => {
    if (wrapperElement.value) {
      wrapperElementHeight.value = wrapperElement.value.clientHeight
      wrapperElement.value.style.setProperty('--dropzone-height', `${wrapperElementHeight.value}px`)
      let titleFontSize = 12
      if (wrapperElementHeight.value > 100 && wrapperElementHeight.value <= 240) {
        titleFontSize = 16
      } else if (wrapperElementHeight.value > 240) {
        titleFontSize = 20
      }
      wrapperElement.value.style.setProperty('--dropzone-title-font', `${titleFontSize}px`)
    }
  })

  const onDragenter = (ev: MouseEvent) => {
    ev.preventDefault()
    isOverDropPlace.value = true
  }
  const onDragleave = (ev: MouseEvent) => {
    ev.preventDefault()
    isOverDropPlace.value = false
  }
  const onDropzoneDragover = (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
  const onDropzoneDragenter = (ev: MouseEvent) => {
    ev.preventDefault()
    isOverDropZone.value = true
  }
  const onDropzoneDragleave = (ev: MouseEvent) => {
    ev.preventDefault()
    isOverDropZone.value = false
  }
  const onDrop = (ev: DragEvent) => {
    ev.stopPropagation()
    ev.preventDefault()
    if (ev.dataTransfer!.files) {
      emit('select', ev.dataTransfer!.files)
    }
    isOverDropPlace.value = false
    isOverDropZone.value = false
  }
</script>

<template>
  <!-- eslint-disable max-len -->
  <div
    ref="wrapperElement"
    class="ui3n-drop-files"
    @dragenter="onDragenter"
    @dragleave="onDragleave"
  >
    <slot />

    <div
      v-if="isOverDropPlace || isOverDropZone"
      class="ui3n-drop-files__dropzone"
      @dragenter="onDropzoneDragenter"
      @dragover="onDropzoneDragover"
      @dragleave="onDropzoneDragleave"
      @drop="onDrop"
    >
      <div class="ui3n-drop-files__dropzone-border" />
      <h3 class="ui3n-drop-files__dropzone-title">
        {{ params.title }}
      </h3>
      <div class="ui3n-drop-files__dropzone-icon">
        <svg
          :width="wrapperElementHeight / 2"
          :height="wrapperElementHeight / 2"
          viewBox="0 0 192 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M51 152C47.9333 152 45.3333 150.934 43.2 148.8C41.0667 146.667 40 144.067 40 141V119.8H46.2V141C46.2 142.2 46.7 143.3 47.7 144.3C48.7 145.3 49.8 145.8 51 145.8H141C142.2 145.8 143.3 145.3 144.3 144.3C145.3 143.3 145.8 142.2 145.8 141V119.8H152V141C152 144.067 150.933 146.667 148.8 148.8C146.667 150.934 144.067 152 141 152H51ZM93 122.4V49.2002L72.8 69.2002L68.4 65.0002L96 37.2002L123.6 65.0002L119.2 69.2002L99 49.2002V122.4H93Z"
            fill="#212121"
          />
        </svg>
      </div>
      <div
        v-if="props.text"
        class="ui3n-drop-files__dropzone-text"
      >
        {{ props.text }}
      </div>
      <div
        v-if="props.additionalText"
        class="ui3n-drop-files__dropzone-additional"
      >
        {{ props.additionalText }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ui3n-drop-files {
    --dropzone-height: 0;
    --dropzone-title-font: 0;

    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    &__dropzone {
      box-sizing: border-box;
      position: absolute;
      background-color: var(--system-white, #fff);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      inset: var(--half-size, 4px) var(--base-size, 8px);
      border-radius: var(--base-size, 8px);
      z-index: 5;

      &-border {
        box-sizing: border-box;
        position: absolute;
        top: calc(var(--base-size, 8px) + 1px);
        bottom: calc(var(--base-size, 8px) + 1px);
        left: calc(var(--base-size, 8px) + 1px);
        right: calc(var(--base-size, 8px) + 1px);
        border-radius: var(--base-size, 8px);
        border: 2px dashed var(--gray-50, #f2f2f2);
        pointer-events: none;
      }

      &-title {
        margin: 0 0 var(--dropzone-title-font);
        font-size: var(--dropzone-title-font);
        font-weight: 600;
        color: var(--black-30, #b3b3b3);
        pointer-events: none;
      }

      &-icon {
        position: relative;
        width: calc(var(--dropzone-height) * 0.4);
        height: calc(var(--dropzone-height) * 0.4);
        border-radius: 50%;
        background-color: var(--gray-50, #f2f2f2);
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
      }

      &-text {
        margin-top: calc(var(--base-size, 8px) * 3);
        font-size: var(--font-12, 12px);
        line-height: var(--font-16, 16px);
        font-weight: 400;
        color: var(--black-30, #b3b3b3);
      }

      &-additional {
        margin-top: var(--half-size, 4px);
        font-size: var(--font-12, 12px);
        font-weight: 500;
        color: var(--black-90, #212121);
      }
    }
  }
</style>
