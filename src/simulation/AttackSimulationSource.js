// ============================================================
// ATTACK SIMULATION SOURCE — interface contract:
//   { subscribe(callback) -> unsubscribe(), start(), stop() }
//
// createScriptedAttackSource() plays a scenario's stages back on
// local timers, for the university demo. Later, a
// createWebSocketAttackSource(url) implementing the SAME three
// methods (subscribing to real /ws/threats events instead of
// setTimeout) can be swapped in wherever a source is created --
// useAttackSimulation.js and every component downstream of it
// only ever call subscribe/start/stop, never setTimeout directly.
// ============================================================

export function createScriptedAttackSource(scenario) {
  let timeoutIds = [];
  const listeners = new Set();

  return {
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    start() {
      this.stop();
      scenario.stages.forEach((stage) => {
        const id = setTimeout(() => {
          listeners.forEach((cb) => cb({ scenario, stage }));
        }, stage.atMs);
        timeoutIds.push(id);
      });
    },
    stop() {
      timeoutIds.forEach(clearTimeout);
      timeoutIds = [];
    },
  };
}

// ------------------------------------------------------------
// FUTURE: real-time replacement, same interface.
//
// export function createWebSocketAttackSource(url) {
//   let socket = null;
//   const listeners = new Set();
//   return {
//     subscribe(callback) { listeners.add(callback); return () => listeners.delete(callback); },
//     start() {
//       socket = new WebSocket(url);
//       socket.onmessage = (msg) => {
//         const event = JSON.parse(msg.data); // { scenario, stage } shape from the backend
//         listeners.forEach((cb) => cb(event));
//       };
//     },
//     stop() { socket?.close(); socket = null; },
//   };
// }
// ------------------------------------------------------------