import { createSlice } from "@reduxjs/toolkit";

type TradeModalProps = {
    isComplete: boolean;
    isFailed: boolean;
    isWaiting: boolean;
}

const initialTradeModalState: TradeModalProps = {
    isComplete: false,
    isFailed: false,
    isWaiting: false,
}

type NoticeModalProps = {
    isOpen: boolean;
    content: string;
    buttonLabel?: string;
    actionType?: string;
}

const initialNoticeModalState: NoticeModalProps = {
    isOpen: false,
    content: '',
    buttonLabel: '확인',
    actionType: '',
}

const noticeModalSlice = createSlice({
    name: 'noticeModal',
    initialState: initialNoticeModalState,
    reducers: {
        showNoticeModal: (state, action) => {
            state.isOpen = true;
            state.content = action.payload.content;
            state.buttonLabel = action.payload.buttonLabel;
            state.actionType = action.payload.actionType;
        },
        hideNoticeModal: (state) => {
            state.isOpen = false;
            state.content = '';
            state.buttonLabel = '확인';
            state.actionType = '';
        }
    }
})

export const { showNoticeModal, hideNoticeModal } = noticeModalSlice.actions;

const reducers = {
    noticeModal: noticeModalSlice.reducer,
}

export default reducers;