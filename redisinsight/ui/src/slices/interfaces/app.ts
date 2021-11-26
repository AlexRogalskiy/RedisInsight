import { AxiosError } from 'axios'
import { Nullable } from 'uiSrc/utils'
import { GetServerInfoResponse } from 'apiSrc/dto/server.dto'
import { ICommands } from 'uiSrc/constants'

export interface IError extends AxiosError {
  id: string;
  instanceId?: string;
}

export interface IMessage {
  id: string;
  title: string;
  message: string;
  group?: string;
}

export interface StateAppInfo {
  loading: boolean;
  error: string;
  server: Nullable<GetServerInfoResponse>;
  analytics: {
    segmentWriteKey: string;
    identified: boolean;
  };
  electron: {
    isUpdateAvailable: Nullable<boolean>;
    updateDownloadedVersion: string;
    isReleaseNotesViewed: Nullable<boolean>;
  };
  isShortcutsFlyoutOpen: boolean;
}

export interface StateAppContext {
  contextInstanceId: string;
  lastPage: string;
  browser: {
    keyList: {
      isDataLoaded: boolean;
      scrollTopPosition: number;
      selectedKey: Nullable<string>;
    },
    panelSizes: {
      [key: string]: number;
    }
  },
  workbench: {
    script: string;
    panelSizes: {
      horizontal: {
        [key: string]: number;
      },
      vertical: {
        [key: string]: number;
      }
    }
  }
}

export interface StateAppRedisCommands {
  loading: boolean;
  error: string;
  spec: ICommands,
  commandsArray: string[],
}

export interface IPluginVisualization {
  id: string;
  uniqId: string
  name: string;
  plugin: any;
  activationMethod: string;
  matchCommands: string[];
  default?: boolean;
}

export interface PluginsResponse {
  static: string;
  plugins: IPlugin[]
}
export interface IPlugin {
  name: string;
  main: string;
  styles: string[];
  baseUrl: string;
  visualizations: any[];
  internal?: boolean;
}

export interface StateAppPlugins {
  loading: boolean;
  error: string;
  staticPath: string;
  plugins: IPlugin[];
  visualizations: IPluginVisualization[];
}
