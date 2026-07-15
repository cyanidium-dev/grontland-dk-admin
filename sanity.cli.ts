import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'g5o00tac',
    dataset: 'production',
  },
  autoUpdates: true,
})
