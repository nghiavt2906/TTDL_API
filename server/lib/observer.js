import { EventEmitter } from "events";

export default class Observer extends EventEmitter {
  /**
   * @param {string} event
   * @param {Array<any>} data
   * @returns {void}
   */
  trigger = (event, ...data) => {
    this.emit(event, ...data);
  };
}
