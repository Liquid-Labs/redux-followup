/**
 * Simple redux middleware function that monkey-patches actions with the
 * 'followupAction' method. Followup actions are queued up and then dispatched
 * after the current action (and possibly other actions) complete. Any actions
 * queued will be dispatched in the order they were received (FIFO).
 */
const followupActionMiddleware = store => next => action => {
  let syncActivityFinished = false
  let actionQueue = []

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a))
    actionQueue = []
  }

  function followupAction(action) {
    actionQueue = actionQueue.concat([action])

    if (syncActivityFinished) {
      flushQueue()
    }
  }

  const monkeyPatchedAction = Object.assign({}, action, { followupAction })

  const res = next(monkeyPatchedAction)
  syncActivityFinished = true
  flushQueue()
  return res
}

export default followupActionMiddleware
