const isSupportAvif = (): Promise<boolean> => {
  if (!createImageBitmap || !Image) return Promise.resolve(false)

  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      createImageBitmap(image)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    }
    image.onerror = () => {
      resolve(false)
    }
    image.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABgAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAQAAAAEAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACBtZGF0EgAKCBgEfaIEBA0IMgofQAAAWAAAAK/2'
  })
}

const isSupportWebp = (): Promise<boolean> => {
  if (!createImageBitmap || !Image) return Promise.resolve(false)

  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      createImageBitmap(image)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    }
    image.onerror = () => {
      resolve(false)
    }
    image.src =
      'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  })
}

const browserSupportDetecter = async () => {
  if (window.BROWSER_SUPPORT_DETECTER) {
    return window.BROWSER_SUPPORT_DETECTER
  } else {
    const result = {
      AVIF: await isSupportAvif(),
      WEBP: await isSupportWebp(),
    }

    window.BROWSER_SUPPORT_DETECTER = result

    return result
  }
}

export { browserSupportDetecter }
