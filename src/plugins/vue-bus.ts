/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import { App, Plugin } from 'vue';
import type { InjectionKey } from 'vue';
import mitt from 'mitt';
import type { CbFunction, VueEventBus } from '../constants';

const emitter = mitt();

export interface VueBusPlugin {
  $emitter: VueEventBus;
}

const $emitter = {
  on: emitter.on.bind(emitter),
  once: (event: string | symbol, handler: CbFunction) => {
    function wrapHandler() {
      emitter.off(event, wrapHandler);
      // @ts-ignore
      // eslint-disable-next-line prefer-spread, prefer-rest-params
      handler.apply(null, arguments);
    }

    emitter.on(event, wrapHandler);
  },
  off: emitter.off.bind(emitter),
  emit: emitter.emit.bind(emitter),
  clear: emitter.all.clear.bind(emitter),
};

export const VUEBUS_KEY = Symbol() as InjectionKey<VueBusPlugin>;

export const vueBus: Plugin = {
  install: (app: App) => {
    app.config.globalProperties.$emitter = $emitter;
    app.provide<VueBusPlugin>(VUEBUS_KEY, { $emitter });
  },
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $emitter: {
      on: (type: string | symbol, handler: CbFunction) => void;
      off: (type: string | symbol, handler?: CbFunction) => void;
      emit: (type: string | symbol, arg?: any) => void;
      once: (type: string | symbol, handler: CbFunction) => void;
      clear: () => void;
    },
  }
}
