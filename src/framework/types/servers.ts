import { IConfiguration, IConfigurationSecurity } from "./configuration";

export interface IGraphQLInitialize {
  expressApp: any;
  configuration: IConfiguration;
  dbTables: Array<any>;
  models: any;
  emailTemplates: Object;
  sendEmail: Function;
  database: any;
  WertikEventEmitter: any;
  context: any;
  runEvent: Function;
}

export interface IRestApiInitialize {
  sendEmail: Function;
  runEvent: Function;
  configuration: IConfiguration;
  expressApp: any;
  dbTables: Array<any>;
  emailTemplates: any;
  models: any;
  database: any;
  WertikEventEmitter: any;
  context: any;
}

// export interface IWSConfiguration {
//   port: Number
// }
export interface ISocketConfiguration {
  onMessageReceived: Function;
  onClientConnected: Function;
  onClientDisconnect: Function;
  disable: Boolean;
  port: Number;
  security: IConfigurationSecurity;
}
