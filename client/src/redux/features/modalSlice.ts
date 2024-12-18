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

const tradeModalSlice = createSlice({
    name: 'tradeModal',
    initialState: initialTradeModalState,
    reducers: {
        setIsTradeComplete: (state, action) => {
            state.isComplete = action.payload;
        },
        setIsTradeFailed: (state, action) => {
            state.isFailed = action.payload;
        },
        setIsTradeWaiting: (state, action) => {
            state.isWaiting = action.payload;
        }
    }
})

export const { showNoticeModal, hideNoticeModal } = noticeModalSlice.actions;
export const { setIsTradeComplete, setIsTradeFailed, setIsTradeWaiting } = tradeModalSlice.actions;

const reducers = {
    noticeModal: noticeModalSlice.reducer,
    tradeModal: tradeModalSlice.reducer,
}

export default reducers;