<script lang="ts" setup>
  import { computed, onMounted, ref, useSlots, watch } from 'vue'
  import { hasSlotContent } from '../tools/ui.helpers'
  import Ui3nIcon from './ui3n-icon.vue'

  export interface Ui3nButtonProps {
    textColor?: string;
    color?: string;
    round?: boolean;
    elevation?: boolean;
    icon?: string;
    iconSize?: string | number;
    iconColor?: string;
    disabled?: boolean;
  }

  export interface Ui3nButtonEmits {
    (ev: 'init', value: HTMLButtonElement): void;
    (ev: 'click', value: Event): void;
    (ev: 'focus', value: Event): void;
    (ev: 'blur', value: Event): void;
  }

  const slots = useSlots()
  const props = defineProps<Ui3nButtonProps>()
  const emits = defineEmits<Ui3nButtonEmits>()

  const buttonEl = ref<HTMLButtonElement | null>(null)
  const isSlotEmpty = computed(() => !hasSlotContent(slots['default']))

  watch(
    [() => props.color, () => props.textColor],
    (newValue: [string|undefined, string|undefined], prevValue: [string|undefined, string|undefined]) => {
      const [ prevColor, prevTextColor ] = prevValue
      const [ color, textColor ] = newValue
      if (buttonEl.value) {
        if (color !== prevColor) {
          buttonEl.value.style.setProperty('--ui3n-button-background', color ?? 'var(--blue-main, #0090ec)')
        }
        if (textColor !== prevTextColor) {
          buttonEl.value.style.setProperty('--ui3n-button-text-color', textColor ?? 'var(--system-white, #fff)')
        }
      }
    },
  )

  onMounted(() => {
    if (buttonEl.value) {
      if (props.color) {
        buttonEl.value.style.setProperty('--ui3n-button-background', props.color)
      }
      if (props.textColor) {
        buttonEl.value.style.setProperty('--ui3n-button-text-color', props.textColor)
      }

      emits('init', buttonEl.value)
    }
  })
</script>

<template>
  <button
    ref="buttonEl"
    :class="[
      'ui3n-button',
      { 'ui3n-button--round': props.round, 'ui3n-button--elevation': props.elevation },
    ]"
    type="button"
    :disabled="props.disabled"
    @click="emits('click', $event)"
    @focusin="emits('focus', $event)"
    @focusout="emits('blur', $event)"
  >
    <ui3n-icon
      v-if="props.icon"
      class="ui3n-button__icon"
      :icon="props.icon"
      :width="props.iconSize"
      :height="props.iconSize"
      :color="props.iconColor || 'var(--ui3n-button-text-color)'"
    />
    <span
      :class="[
        'ui3n-button__text',
        { 'ui3n-button__text--margin': !isSlotEmpty && props.icon },
      ]"
    >
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
  @import "../assets/styles/mixins";

  .ui3n-button {
    --ui3n-button-text-size: 12px;
    --ui3n-button-text-height: 16px;
    --ui3n-button-text-color: var(--system-white, #fff);
    --ui3n-button-background: var(--blue-main, #0090ec);
    --ui3n-button-padding-vert: 8px;
    --ui3n-button-padding-horiz: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    padding: var(--ui3n-button-padding-vert) var(--ui3n-button-padding-horiz);
    border-radius: 4px;
    background: var(--ui3n-button-background);
    font-size: var(--ui3n-button-text-size);
    line-height: var(--ui3n-button-text-height);
    font-weight: 600;
    color: var(--ui3n-button-text-color);
    user-select: none;

    &--round {
      --ui3n-button-padding-vert: 6px;
      --ui3n-button-padding-horiz: 6px;

      border-radius: 50%;
    }

    &--elevation {
      @include elevation();
    }

    &:not([disabled]) {
      &:hover {
        box-shadow: 0 0 4px var(--shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));

        .ui3n-button {
          &__icon,
          &__text {
            opacity: 1;
          }
        }
      }
    }

    &__icon {
      opacity: 0.85;
      transition: opacity 0.2s ease-in-out;
    }

    &__text {
      display: flex;
      opacity: 0.85;
      transition: opacity 0.2s ease-in-out;

      &--margin {
        margin-left: 4px;
      }
    }

    &[disabled] {
      opacity: 0.7;
    }

    &:not(.ui3n-button--round) {
      .ui3n-button {
        &__icon,
        &__text {
          pointer-events: none
        }
      }
    }

    @include ripple(var(--ui3n-button-background));
  }
</style>
