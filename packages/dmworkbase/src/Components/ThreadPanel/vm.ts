import { Thread } from "../../Service/Thread"
import { Message } from "wukongimjssdk"
import WKApp from "../../App"
import { t } from "../../i18n"

export interface ThreadPanelState {
  loading: boolean
  thread: Thread | null
  parentMessage: Message | null
  replies: Message[]
  hasMore: boolean
  error: string | null
}

export class ThreadPanelVM {
  private groupNo: string
  private threadShortId: string
  private onStateChange: (state: ThreadPanelState) => void

  private state: ThreadPanelState = {
    loading: true,
    thread: null,
    parentMessage: null,
    replies: [],
    hasMore: false,
    error: null,
  }

  constructor(
    groupNo: string,
    threadShortId: string,
    onStateChange: (state: ThreadPanelState) => void
  ) {
    this.groupNo = groupNo
    this.threadShortId = threadShortId
    this.onStateChange = onStateChange
  }

  getState(): ThreadPanelState {
    return this.state
  }

  private setState(newState: Partial<ThreadPanelState>) {
    this.state = { ...this.state, ...newState }
    this.onStateChange(this.state)
  }

  async load() {
    this.setState({ loading: true, error: null })
    try {
      const thread = await WKApp.dataSource.channelDataSource.threadGet(
        this.groupNo,
        this.threadShortId
      )
      this.setState({ loading: false, thread })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("base.threadPanel.loadFailed")
      this.setState({ loading: false, error: msg })
    }
  }
}
