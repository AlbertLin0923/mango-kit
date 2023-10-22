class Storage {
  getItem(
    key: string,
    defaultValue?: any,
    storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
  ) {
    try {
      return JSON.parse(
        window[storageType].getItem(key.toUpperCase()) ??
          JSON.stringify({ value: defaultValue ?? '' }),
      )?.value
    } catch (error) {
      console.error(error)
    }
  }
  setItem(
    key: string,
    value: any,
    storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
  ) {
    window[storageType].setItem(key.toUpperCase(), JSON.stringify({ value }))
  }
  removeItem(
    key: string,
    storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
  ) {
    return window[storageType].removeItem(key)
  }
  clear(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
    window[storageType].clear()
  }
}

const storage = new Storage()

export { storage }
