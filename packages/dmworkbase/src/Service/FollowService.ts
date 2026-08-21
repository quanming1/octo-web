import APIClient from "./APIClient"

/** target_type 枚举: 1=DM, 2=群, 5=子区 */
export const FollowTargetType = {
    DM: 1,
    CHANNEL: 2,
    THREAD: 5,
} as const

export interface FollowDmReq {
    peer_uid: string
    /** 后端 group_category.category_id (VARCHAR(32) UUID)；未分类时不传或传 null */
    category_id?: string | null
}

export interface UnfollowChannelReq {
    group_no: string
}

export interface RefollowChannelReq {
    group_no: string
}

export interface FollowThreadReq {
    thread_channel_id: string
}

export interface SortItem {
    target_type: number
    target_id: string
    sort: number
}

export interface SortFollowsReq {
    items: SortItem[]
    version: number
}

const FollowService = {
    /** 关注 DM */
    followDM(req: FollowDmReq): Promise<void> {
        return APIClient.shared.post("/follow/dm", req)
    },

    /** 取消关注 DM */
    unfollowDM(peerUid: string): Promise<void> {
        return APIClient.shared.delete("/follow/dm", { param: { peer_uid: peerUid } })
    },

    /** 取消关注群 */
    unfollowChannel(req: UnfollowChannelReq): Promise<void> {
        return APIClient.shared.post("/follow/channel/unfollow", req)
    },

    /** 重新关注群 */
    refollowChannel(req: RefollowChannelReq): Promise<void> {
        return APIClient.shared.post("/follow/channel/refollow", req)
    },

    /** 关注子区 */
    followThread(req: FollowThreadReq): Promise<void> {
        return APIClient.shared.post("/follow/thread", req)
    },

    /** 取消关注子区 */
    unfollowThread(threadChannelId: string): Promise<void> {
        return APIClient.shared.delete("/follow/thread", { param: { thread_channel_id: threadChannelId } })
    },

    /** 批量排序关注项 */
    sort(req: SortFollowsReq): Promise<void> {
        return APIClient.shared.put("/follow/sort", req)
    },
}

export default FollowService
