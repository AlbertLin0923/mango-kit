export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader?.result)
    reader.onerror = (error) => reject(error)
  })
}

export const fileToBlob = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => resolve(reader?.result)
    reader.onerror = (error) => reject(error)
  })
}

export const getImageRect = (base64OrUrl: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = base64OrUrl
    image.onload = () =>
      resolve({ width: image?.width, height: image?.height, image: image })
    image.onerror = (error) => reject(error)
  })
}

export const getFileExtName = (fileName: string) => {
  const matches = fileName.match(/\.([^.]+$)/)
  if (matches) {
    return matches[1].toLowerCase()
  }
  return ''
}

export const download = (url: string, fileName?: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName ?? ''
  link.click()
}
