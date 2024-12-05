type Params = {
    isEmpty: boolean,
    label: string,
    isSubmitted: boolean,
    isInvalid?: boolean,
}

export default function InputWarning({ isEmpty, label, isSubmitted, isInvalid }: Params) {
    return (
        (isInvalid || isEmpty) && isSubmitted ?
            <div style={{ marginTop: '-7px', fontSize: '13px', color: 'red' }}>{label}</div> :
            null
    )
}