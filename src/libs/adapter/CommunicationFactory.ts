import { CommunicationAdapter } from "./CommunicationAdapter";
import { WebView2Adapter } from "./WebView2Adapter";
import { ElectronAdapter } from "./ElectronAdapter";
import { IframeAdapter } from "./IframeAdapter";
import { NormalWebsiteAdapter } from "./NormalWebsiteAdapter";
import { DSBridgeAdapter } from "./DSBridgeAdapter";

export class CommunicationFactory {
  private static instance: CommunicationAdapter | null = null;

  static createAdapter(): CommunicationAdapter {
    if (this.instance) {
      console.log("this.instance:", this.instance);
      return this.instance; // Return existing instance
    }

    if (window.asyncBridge) {
      console.log("WebView2Adapter");
      this.instance = new WebView2Adapter();
    } else if (window.dsBridge) {
      console.log("DSBridgeAdapter detected");
      this.instance = new DSBridgeAdapter();
    } else if (window.electron) {
      console.log("ElectronAdapter");
      this.instance = new ElectronAdapter();
    } else if (window.parent !== window || window.opener) {
      console.log("IframeAdapter detected");
      this.instance = new IframeAdapter();
    } else {
      console.log("NormalWebsiteAdapter detected");
      this.instance = new NormalWebsiteAdapter();
    }

    return this.instance;
  }
}
