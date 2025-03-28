import React from 'react';

type TransferInputProps = {
    label: string;
    amount: number | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    limitReached: boolean;
    amountEmpty: boolean;
    overflow?: boolean;
};

export default function TransferInput({ label,
    amount,
    onChange,
    limitReached,
    amountEmpty,
    overflow }: TransferInputProps) {
    return (
        <div className={`transfer-input 
        ${limitReached || amountEmpty || overflow ? "warning-border" : ""}`}>
            <div>{label}</div>
            <div className="transfer-input-div">
                <input
                    onChange={onChange}
                    value={amount ? amount.toLocaleString() : ""}
                    placeholder="1,000 ~ 10,000,000" />
                <span>KRW</span>
            </div>
        </div>
    );
}