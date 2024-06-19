type Params = {
    id: string;
    checked: boolean;
    onChange: () => void;
    label: string;
}

export default function RadioInput({ id, checked, onChange, label }: Params) {
    return (
        <>
            <div className="cursor-pointer">
                <div className="radio-container">
                    <input
                        className="radio-input cursor-pointer"
                        type="radio"
                        name="radio"
                        id={id}
                        onChange={onChange}
                        checked={checked} />
                    <label
                        className="cursor-pointer no-drag"
                        htmlFor={id}>
                        {label}
                    </label>
                </div>
            </div>
        </>
    )
}