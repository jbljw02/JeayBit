import React from 'react';

type TransferInputProps = {
    label: string;
    amount: number | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    limitReached: boolean;
    amountEmpty: boolean;
};

export default function TransferInput({ label,
    amount,
    onChange,
    limitReached,
    amountEmpty, }: TransferInputProps) {
    return (
        <div className={`transfer-input ${limitReached || amountEmpty ? "warning-border" : ""}`}>
            <div>{label}</div>
            <input
                onChange={onChange}
                value={amount ? amount.toLocaleString() : ""}
                placeholder="1,000 ~ 10,000,000" />
            <span>KRW</span>
        </div>
    );
}