/**
 * Original code from [Marcelo Lazaroni](https://lazamar.github.io/dispatching-from-inside-of-reducers/)
 * TODO: better name should maybe be 'dispatchNext'. 'async' is kind of overloaded and 'next' is in any case more precise.
 */
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch =
      Object.assign({}, action, { asyncDispatch });

  const res = next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
  return res;
};

export default asyncDispatchMiddleware;
