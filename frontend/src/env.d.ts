interface DesktopApi {
  getVersions: () => {
    chrome: string
    electron: string
    node: string
  }
}

interface Window {
  desktop: DesktopApi
}
