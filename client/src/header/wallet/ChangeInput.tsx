import React from 'react';

type ChangeInputProps = {
    amount: number;
    market: string;
};

export function ChangeInput({  amount, market }: ChangeInputProps) {
    return (
        <div className="change-input">
            <div>전환량</div>
            <div className="change-input-div">
                <input value={amount} readOnly />
                <span className="change-input-span">{market}</span>
            </div>
        </div>
    );
}