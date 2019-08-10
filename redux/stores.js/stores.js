import reducer from '../reducers/reducers'

export default function configureStore() {
  let store = createStore(
    reducer
  )

  return store
}
