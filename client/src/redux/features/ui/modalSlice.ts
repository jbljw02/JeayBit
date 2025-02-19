import { createSlice } from "@reduxjs/toolkit";
import { NoticeModalProps } from "../../../types/trade.type";

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