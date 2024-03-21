import Repository from '../Repository'
import { authHeader } from '../authHeader'

export default {
    getListGroup(payload: any) {
        return Repository.post(`/chat/get-list-group`, payload, { headers: authHeader() })
    },
    getStoryByGroup(payload: any) {
        return Repository.get(`/chat/get-history-chat?groupChatId=${payload?.groupChatId}&pageSize=${payload?.pageSize}&pageNum=${payload?.pageNum}`, { headers: authHeader() })
    },
    getMemberByGroup(payload: any) {
        return Repository.get(`/chat/get-members-group-chat?groupChatId=${payload?.groupChatId}`, { headers: authHeader() })
    },
    search(payload: any) {
        return Repository.get(`/chat/search-chat?groupChatId=${payload?.groupChatId}&pageSize=20&pageNum=1&search=${payload?.value}`, { headers: authHeader() })
    },
    searchTo(payload: any) {
        return Repository.get(`/chat/search-chat-to?roomChatId=${payload?.number}`, { headers: authHeader() })
    },
    searchFrom(payload: any) {
        return Repository.get(`/chat/search-chat-from?roomChatId=${payload?.number}`, { headers: authHeader() })
    },
    searchMemberToGroup(payload: any) {
        return Repository.post(`/member/get-list`, payload, { headers: authHeader() })
    },
    createNewGroupChat(payload: any) {
        return Repository.post(`/chat/add-group`, payload, { headers: authHeader() })
    },
    createChatVsSupporter(payload: any) {
        return Repository.post(`/chat/add-group/with-supporter`, payload, { headers: authHeader() })
    },
    deliveryContent(payload: any) {
        return Repository.get(`/chat/find-group-chat/1-1?userChatId=${payload?.userChatId}`, { headers: authHeader() })
    },
    getMessagePinned(payload: any) {
        return Repository.get(`/chat/get-message-pinned?groupChatId=${payload?.groupChatId}`, { headers: authHeader() })
    },
    pinMessage(payload: any) {
        return Repository.put(`/chat/pin-message?groupChatId=${payload?.groupChatId}&roomChatId=${payload?.roomChatId}`, payload, { headers: authHeader() })
    },
}
